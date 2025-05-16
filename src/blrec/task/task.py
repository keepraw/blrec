import os
from contextlib import suppress
from pathlib import PurePath
from typing import Iterator, List, Optional

from blrec.bili.live import Live
from blrec.bili.live_monitor import LiveMonitor
from blrec.bili.models import RoomInfo, UserInfo
from blrec.bili.typing import QualityNumber, StreamFormat
from blrec.core import Recorder
from blrec.core.cover_downloader import CoverSaveStrategy
from blrec.core.typing import MetaData
from blrec.event.event_submitters import (
    LiveEventSubmitter,
    PostprocessorEventSubmitter,
    RecorderEventSubmitter,
)
from blrec.flv.metadata_injection import InjectingProgress
from blrec.flv.operators import StreamProfile
from blrec.postprocess import DeleteStrategy, Postprocessor, PostprocessorStatus
from blrec.postprocess.remux import RemuxingProgress
from blrec.setting.typing import RecordingMode

from .models import (
    RunningStatus,
    TaskStatus,
    VideoFileDetail,
    VideoFileStatus,
)

__all__ = ('RecordTask',)


class RecordTask:
    def __init__(
        self,
        live: Live,
        out_dir: str,
        path_template: str,
        *,
        stream_format: StreamFormat = 'flv',
        recording_mode: RecordingMode = 'standard',
        quality_number: QualityNumber = 10000,
        fmp4_stream_timeout: int = 10,
        buffer_size: Optional[int] = None,
        read_timeout: Optional[int] = None,
        disconnection_timeout: Optional[int] = None,
        filesize_limit: int = 0,
        duration_limit: int = 0,
        save_cover: bool = False,
        cover_save_strategy: CoverSaveStrategy = CoverSaveStrategy.DEFAULT,
        remux_to_mp4: bool = False,
        inject_extra_metadata: bool = False,
        delete_source: DeleteStrategy = DeleteStrategy.AUTO,
    ) -> None:
        self._live = live
        self._out_dir = out_dir
        self._path_template = path_template
        self._stream_format = stream_format
        self._recording_mode = recording_mode
        self._quality_number = quality_number
        self._fmp4_stream_timeout = fmp4_stream_timeout
        self._buffer_size = buffer_size
        self._read_timeout = read_timeout
        self._disconnection_timeout = disconnection_timeout
        self._filesize_limit = filesize_limit
        self._duration_limit = duration_limit
        self._save_cover = save_cover
        self._cover_save_strategy = cover_save_strategy
        self._remux_to_mp4 = remux_to_mp4
        self._inject_extra_metadata = inject_extra_metadata
        self._delete_source = delete_source

        self._ready: bool = False
        self._monitor_enabled: bool = False
        self._recorder_enabled: bool = False

    @property
    def user_agent(self) -> str:
        return self._live.user_agent

    @user_agent.setter
    def user_agent(self, value: str) -> None:
        self._live.user_agent = value

    @property
    def cookie(self) -> str:
        return self._live.cookie

    @cookie.setter
    def cookie(self, value: str) -> None:
        self._live.cookie = value

    @property
    def save_cover(self) -> bool:
        return self._recorder.save_cover

    @save_cover.setter
    def save_cover(self, value: bool) -> None:
        self._recorder.save_cover = value

    @property
    def cover_save_strategy(self) -> CoverSaveStrategy:
        return self._recorder.cover_save_strategy

    @cover_save_strategy.setter
    def cover_save_strategy(self, value: CoverSaveStrategy) -> None:
        self._recorder.cover_save_strategy = value

    @property
    def stream_format(self) -> StreamFormat:
        return self._recorder.stream_format

    @stream_format.setter
    def stream_format(self, value: StreamFormat) -> None:
        self._recorder.stream_format = value

    @property
    def recording_mode(self) -> RecordingMode:
        return self._recorder.recording_mode

    @recording_mode.setter
    def recording_mode(self, value: RecordingMode) -> None:
        self._recorder.recording_mode = value

    @property
    def quality_number(self) -> QualityNumber:
        return self._recorder.quality_number

    @quality_number.setter
    def quality_number(self, value: QualityNumber) -> None:
        self._recorder.quality_number = value

    @property
    def fmp4_stream_timeout(self) -> int:
        return self._recorder.fmp4_stream_timeout

    @fmp4_stream_timeout.setter
    def fmp4_stream_timeout(self, value: int) -> None:
        self._recorder.fmp4_stream_timeout = value

    @property
    def real_stream_format(self) -> Optional[StreamFormat]:
        return self._recorder.real_stream_format

    @property
    def real_quality_number(self) -> Optional[QualityNumber]:
        return self._recorder.real_quality_number

    @property
    def buffer_size(self) -> int:
        return self._recorder.buffer_size

    @buffer_size.setter
    def buffer_size(self, value: int) -> None:
        self._recorder.buffer_size = value

    @property
    def read_timeout(self) -> int:
        return self._recorder.read_timeout

    @read_timeout.setter
    def read_timeout(self, value: int) -> None:
        self._recorder.read_timeout = value

    @property
    def disconnection_timeout(self) -> int:
        return self._recorder.disconnection_timeout

    @disconnection_timeout.setter
    def disconnection_timeout(self, value: int) -> None:
        self._recorder.disconnection_timeout = value

    @property
    def stream_url(self) -> str:
        return self._recorder.stream_url

    @property
    def stream_host(self) -> str:
        return self._recorder.stream_host

    @property
    def dl_total(self) -> int:
        return self._recorder.dl_total

    @property
    def dl_rate(self) -> float:
        return self._recorder.dl_rate

    @property
    def rec_elapsed(self) -> float:
        return self._recorder.rec_elapsed

    @property
    def rec_total(self) -> int:
        return self._recorder.rec_total

    @property
    def rec_rate(self) -> float:
        return self._recorder.rec_rate

    @property
    def out_dir(self) -> str:
        return self._recorder.out_dir

    @out_dir.setter
    def out_dir(self, value: str) -> None:
        self._recorder.out_dir = value

    @property
    def path_template(self) -> str:
        return self._recorder.path_template

    @path_template.setter
    def path_template(self, value: str) -> None:
        self._recorder.path_template = value

    @property
    def filesize_limit(self) -> int:
        return self._recorder.filesize_limit

    @filesize_limit.setter
    def filesize_limit(self, value: int) -> None:
        self._recorder.filesize_limit = value

    @property
    def duration_limit(self) -> int:
        return self._recorder.duration_limit

    @duration_limit.setter
    def duration_limit(self, value: int) -> None:
        self._recorder.duration_limit = value

    @property
    def recording_path(self) -> Optional[str]:
        return self._recorder.recording_path

    @property
    def metadata(self) -> Optional[MetaData]:
        return self._recorder.metadata

    @property
    def stream_profile(self) -> StreamProfile:
        return self._recorder.stream_profile

    def get_recording_files(self) -> Iterator[str]:
        if self._recorder.recording_path is not None:
            yield self._recorder.recording_path

    def get_video_files(self) -> Iterator[str]:
        yield from self._recorder.get_files()

    def can_cut_stream(self) -> bool:
        return self._recorder.can_cut_stream()

    def cut_stream(self) -> bool:
        return self._recorder.cut_stream()

    async def setup(self) -> None:
        await self._live.init()
        await self._setup()
        self._ready = True

    async def destroy(self) -> None:
        await self._destroy()
        await self._live.deinit()
        self._ready = False

    async def enable_monitor(self) -> None:
        if self._monitor_enabled:
            return
        self._monitor_enabled = True
        self._live_monitor.enable()

    async def disable_monitor(self) -> None:
        if not self._monitor_enabled:
            return
        self._monitor_enabled = False
        self._live_monitor.disable()

    async def enable_recorder(self) -> None:
        if self._recorder_enabled:
            return
        self._recorder_enabled = True

        await self._postprocessor.start()
        await self._recorder.start()

    async def disable_recorder(self, force: bool = False) -> None:
        if not self._recorder_enabled:
            return
        self._recorder_enabled = False

        if force:
            await self._postprocessor.stop()
            await self._recorder.stop()
        else:
            await self._recorder.stop()
            await self._postprocessor.stop()

    async def update_info(self, raise_exception: bool = False) -> bool:
        return await self._live.update_info(raise_exception=raise_exception)

    async def _setup(self) -> None:
        self._setup_live_monitor()
        self._setup_live_event_submitter()
        self._setup_recorder()
        self._setup_recorder_event_submitter()
        self._setup_postprocessor()
        self._setup_postprocessor_event_submitter()

    def _setup_live_monitor(self) -> None:
        self._live_monitor = LiveMonitor(self._live)

    def _setup_live_event_submitter(self) -> None:
        self._live_event_submitter = LiveEventSubmitter(self._live_monitor)

    def _setup_recorder(self) -> None:
        self._recorder = Recorder(
            self._live,
            self._live_monitor,
            self._out_dir,
            self._path_template,
            stream_format=self._stream_format,
            recording_mode=self._recording_mode,
            quality_number=self._quality_number,
            fmp4_stream_timeout=self._fmp4_stream_timeout,
            buffer_size=self._buffer_size,
            read_timeout=self._read_timeout,
            disconnection_timeout=self._disconnection_timeout,
            filesize_limit=self._filesize_limit,
            duration_limit=self._duration_limit,
            save_cover=self._save_cover,
            cover_save_strategy=self._cover_save_strategy,
        )

    def _setup_recorder_event_submitter(self) -> None:
        self._recorder_event_submitter = RecorderEventSubmitter(self._recorder)

    def _setup_postprocessor(self) -> None:
        self._postprocessor = Postprocessor(
            self._live,
            self._recorder,
            remux_to_mp4=self._remux_to_mp4,
            inject_extra_metadata=self._inject_extra_metadata,
            delete_source=self._delete_source,
        )

    def _setup_postprocessor_event_submitter(self) -> None:
        self._postprocessor_event_submitter = PostprocessorEventSubmitter(
            self._postprocessor
        )

    async def _destroy(self) -> None:
        self._destroy_postprocessor_event_submitter()
        self._destroy_postprocessor()
        self._destroy_recorder_event_submitter()
        self._destroy_recorder()
        self._destroy_live_event_submitter()
        self._destroy_live_monitor()

    def _destroy_live_monitor(self) -> None:
        with suppress(AttributeError):
            del self._live_monitor

    def _destroy_live_event_submitter(self) -> None:
        with suppress(AttributeError):
            del self._live_event_submitter

    def _destroy_recorder(self) -> None:
        with suppress(AttributeError):
            del self._recorder

    def _destroy_recorder_event_submitter(self) -> None:
        with suppress(AttributeError):
            del self._recorder_event_submitter

    def _destroy_postprocessor(self) -> None:
        with suppress(AttributeError):
            del self._postprocessor

    def _destroy_postprocessor_event_submitter(self) -> None:
        with suppress(AttributeError):
            del self._postprocessor_event_submitter
