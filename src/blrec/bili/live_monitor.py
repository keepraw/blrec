import asyncio
import random
from contextlib import suppress
from typing import Optional

from loguru import logger

from blrec.exception import exception_callback
from blrec.logging.context import async_task_with_logger_context

from ..event.event_emitter import EventEmitter, EventListener
from ..utils.mixins import SwitchableMixin
from .helpers import extract_formats
from .live import Live
from .models import LiveStatus, RoomInfo

__all__ = 'LiveMonitor', 'LiveEventListener'


class LiveEventListener(EventListener):
    async def on_live_status_changed(
        self, current_status: LiveStatus, previous_status: LiveStatus
    ) -> None:
        ...

    async def on_live_began(self, live: Live) -> None:
        ...

    async def on_live_ended(self, live: Live) -> None:
        ...

    async def on_live_stream_available(self, live: Live) -> None:
        ...

    async def on_live_stream_reset(self, live: Live) -> None:
        ...

    async def on_room_changed(self, room_info: RoomInfo) -> None:
        ...


class LiveMonitor(EventEmitter[LiveEventListener], SwitchableMixin):
    def __init__(self, live: Live) -> None:
        super().__init__()
        self._logger_context = {'room_id': live.room_id}
        self._logger = logger.bind(**self._logger_context)

        self._live = live
        self._previous_status = LiveStatus.PREPARING
        self._status_count = 0
        self._stream_available = False
        self._checking_task: Optional[asyncio.Task] = None
        self._is_shutting_down = False

    def _do_enable(self) -> None:
        if not self._is_shutting_down:
            self._start_checking()
            self._logger.debug('Enabled live monitor')

    def _do_disable(self) -> None:
        self._stop_checking()
        self._logger.debug('Disabled live monitor')

    async def shutdown(self) -> None:
        """安全关闭 LiveMonitor"""
        self._is_shutting_down = True
        self._do_disable()
        if self._live is not None:
            await self._live.deinit()
            self._live = None
        self._logger.debug('LiveMonitor shutdown complete')

    def _start_checking(self) -> None:
        if self._checking_task is None and not self._is_shutting_down:
            self._checking_task = asyncio.create_task(self._check_loop())
            self._checking_task.add_done_callback(exception_callback)

    def _stop_checking(self) -> None:
        if self._checking_task is not None:
            self._checking_task.cancel()
            self._checking_task = None

    @async_task_with_logger_context
    async def _check_loop(self) -> None:
        while not self._is_shutting_down:
            try:
                if self._live is None:
                    self._logger.error('Live object is None, stopping check loop')
                    break
                    
                await self._live.update_room_info()
                if self._live.room_info is None:
                    self._logger.error('Room info is None after update')
                    await asyncio.sleep(5)
                    continue
                    
                current_status = self._live.room_info.live_status
                await self._handle_status_change(current_status)
            except asyncio.CancelledError:
                self._logger.debug('Check loop cancelled')
                break
            except Exception as e:
                self._logger.error(f'Failed to check live status: {repr(e)}')
                if self._is_shutting_down:
                    break
                await asyncio.sleep(5)  # 发生错误时等待5秒再重试
            else:
                await asyncio.sleep(5)  # 正常情况下的检查间隔

    async def _handle_status_change(self, current_status: LiveStatus) -> None:
        self._logger.debug(
            'Live status changed from {} to {}'.format(
                self._previous_status.name, current_status.name
            )
        )

        await self._emit('live_status_changed', current_status, self._previous_status)

        if current_status != LiveStatus.LIVE:
            self._status_count = 0
            self._stream_available = False
            await self._emit('live_ended', self._live)
            await self._stop_checking()
        else:
            self._status_count += 1

            if self._status_count == 1:
                assert self._previous_status != LiveStatus.LIVE
                await self._emit('live_began', self._live)
                self._start_checking()
            elif self._status_count == 2:
                assert self._previous_status == LiveStatus.LIVE
            elif self._status_count >= 5:
                assert self._previous_status == LiveStatus.LIVE
                await self._emit('live_stream_reset', self._live)
            else:
                pass

        self._logger.debug(
            'Number of sequential LIVE status: {}'.format(self._status_count)
        )

        self._previous_status = current_status

    async def check_live_status(self) -> None:
        self._logger.debug('Checking live status...')
        try:
            await self._check_live_status()
        except Exception as e:
            self._logger.warning(f'Failed to check live status: {repr(e)}')
        self._logger.debug('Done checking live status')

    async def _check_live_status(self) -> None:
        await self._live.update_room_info()
        current_status = self._live.room_info.live_status
        if current_status != self._previous_status:
            await self._handle_status_change(current_status)

    @async_task_with_logger_context
    async def _poll_live_status(self) -> None:
        self._logger.debug('Started polling live status')

        while True:
            try:
                await asyncio.sleep(600 + random.randrange(-60, 60))
                await self._check_live_status()
            except asyncio.CancelledError:
                self._logger.debug('Cancelled polling live status')
                break
            except Exception as e:
                self._logger.warning(f'Failed to poll live status: {repr(e)}')

        self._logger.debug('Stopped polling live status')

    @async_task_with_logger_context
    async def _check_if_stream_available(self) -> None:
        self._logger.debug('Started checking if stream available')

        while True:
            try:
                streams = await self._live.get_live_streams()
                if streams:
                    self._logger.debug('live stream available')
                    self._stream_available = True
                    flv_formats = extract_formats(streams, 'flv')
                    self._live._no_flv_stream = not flv_formats
                    await self._emit('live_stream_available', self._live)
                    break
            except asyncio.CancelledError:
                self._logger.debug('Cancelled checking if stream available')
                break
            except Exception as e:
                self._logger.warning(f'Failed to check if stream available: {repr(e)}')

            await asyncio.sleep(1)

        self._logger.debug('Stopped checking if stream available')
