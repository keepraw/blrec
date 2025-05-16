from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Optional, cast

from ..exception import NotFoundError
from ..logging import configure_logger
from ..notification import (
    EmailService,
    Notifier,
    Pushdeer,
    Pushplus,
    Serverchan,
    Telegram,
    Bark,
)
from ..webhook import WebHook
from .helpers import shadow_settings, update_settings
from .models import (
    HeaderOptions,
    MessageTemplateSettings,
    NotificationSettings,
    NotifierSettings,
    OutputOptions,
    PostprocessingOptions,
    RecorderOptions,
    Settings,
    SettingsIn,
    SettingsOut,
    TaskOptions,
    TaskSettings,
)
from .typing import KeySetOfSettings

if TYPE_CHECKING:
    from ..application import Application


class SettingsManager:
    def __init__(self, app: Application, settings: Settings) -> None:
        self._app = app
        self._settings = settings

    def get_settings(
        self,
        include: Optional[KeySetOfSettings] = None,
        exclude: Optional[KeySetOfSettings] = None,
    ) -> SettingsOut:
        return SettingsOut(**self._settings.dict(include=include, exclude=exclude))

    async def change_settings(self, settings: SettingsIn) -> SettingsOut:
        changed = False

        for name in settings.__fields_set__:
            src_sub_settings = getattr(settings, name)
            dst_sub_settings = getattr(self._settings, name)

            if src_sub_settings == dst_sub_settings:
                continue

            if isinstance(src_sub_settings, list):
                assert isinstance(dst_sub_settings, list)
                setattr(self._settings, name, src_sub_settings)
            else:
                update_settings(src_sub_settings, dst_sub_settings)
            changed = True

            func = getattr(self, f'apply_{name}_settings')
            if asyncio.iscoroutinefunction(func):
                await func()
            else:
                func()

        if changed:
            await self.dump_settings()

        return self.get_settings(cast(KeySetOfSettings, settings.__fields_set__))

    def get_task_options(self, room_id: int) -> TaskOptions:
        if settings := self.find_task_settings(room_id):
            return TaskOptions.from_settings(settings)
        raise NotFoundError(f'task settings of room {room_id} not found')

    async def change_task_options(
        self, room_id: int, options: TaskOptions
    ) -> TaskOptions:
        settings = self.find_task_settings(room_id)
        assert settings is not None

        changed = False

        for name in options.__fields_set__:
            src_opts = getattr(options, name)
            dst_opts = getattr(settings, name)

            if src_opts == dst_opts:
                continue

            update_settings(src_opts, dst_opts)
            changed = True

            func = getattr(self, f'apply_task_{name}_settings')
            if asyncio.iscoroutinefunction(func):
                await func(room_id, dst_opts)
            else:
                func(room_id, dst_opts)

        if changed:
            await self.dump_settings()

        return TaskOptions.from_settings(settings)

    async def dump_settings(self) -> None:
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, self._settings.dump)

    def has_task_settings(self, room_id: int) -> bool:
        return self.find_task_settings(room_id) is not None

    def find_task_settings(self, room_id: int) -> Optional[TaskSettings]:
        for settings in self._settings.tasks:
            if settings.room_id == room_id:
                return settings
        return None

    async def add_task_settings(self, room_id: int) -> TaskSettings:
        settings = TaskSettings(room_id=room_id)
        self._settings.tasks = [*self._settings.tasks, settings]
        await self.dump_settings()
        return settings.copy(deep=True)

    async def remove_task_settings(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        if settings is None:
            raise NotFoundError(f"The room {room_id} is not existed")
        self._settings.tasks.remove(settings)
        await self.dump_settings()

    async def remove_all_task_settings(self) -> None:
        self._settings.tasks.clear()
        await self.dump_settings()

    async def mark_task_enabled(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        assert settings is not None
        settings.enable_monitor = True
        settings.enable_recorder = True
        await self.dump_settings()

    async def mark_task_disabled(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        assert settings is not None
        settings.enable_monitor = False
        settings.enable_recorder = False
        await self.dump_settings()

    async def mark_all_tasks_enabled(self) -> None:
        for settings in self._settings.tasks:
            settings.enable_monitor = True
            settings.enable_recorder = True
        await self.dump_settings()

    async def mark_all_tasks_disabled(self) -> None:
        for settings in self._settings.tasks:
            settings.enable_monitor = False
            settings.enable_recorder = False
        await self.dump_settings()

    async def mark_task_monitor_enabled(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        assert settings is not None
        settings.enable_monitor = True
        await self.dump_settings()

    async def mark_task_monitor_disabled(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        assert settings is not None
        settings.enable_monitor = False
        await self.dump_settings()

    async def mark_all_task_monitors_enabled(self) -> None:
        for settings in self._settings.tasks:
            settings.enable_monitor = True
        await self.dump_settings()

    async def mark_all_task_monitors_disabled(self) -> None:
        for settings in self._settings.tasks:
            settings.enable_monitor = False
        await self.dump_settings()

    async def mark_task_recorder_enabled(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        assert settings is not None
        settings.enable_recorder = True
        await self.dump_settings()

    async def mark_task_recorder_disabled(self, room_id: int) -> None:
        settings = self.find_task_settings(room_id)
        assert settings is not None
        settings.enable_recorder = False
        await self.dump_settings()

    async def mark_all_task_recorders_enabled(self) -> None:
        for settings in self._settings.tasks:
            settings.enable_recorder = True
        await self.dump_settings()

    async def mark_all_task_recorders_disabled(self) -> None:
        for settings in self._settings.tasks:
            settings.enable_recorder = False
        await self.dump_settings()

    async def apply_task_header_settings(
        self,
        room_id: int,
        options: HeaderOptions,
    ) -> None:
        final_settings = self._settings.header.copy()
        shadow_settings(options, final_settings)
        await self._app._task_manager.apply_task_header_settings(
            room_id, final_settings
        )

    def apply_task_recorder_settings(
        self, room_id: int, options: RecorderOptions
    ) -> None:
        final_settings = self._settings.recorder.copy()
        shadow_settings(options, final_settings)
        self._app._task_manager.apply_task_recorder_settings(room_id, final_settings)

    def apply_task_output_settings(self, room_id: int, options: OutputOptions) -> None:
        final_settings = self._settings.output.copy()
        shadow_settings(options, final_settings)
        self._app._task_manager.apply_task_output_settings(room_id, final_settings)

    def apply_task_postprocessing_settings(
        self, room_id: int, options: PostprocessingOptions
    ) -> None:
        final_settings = self._settings.postprocessing.copy()
        shadow_settings(options, final_settings)
        self._app._task_manager.apply_task_postprocessing_settings(
            room_id, final_settings
        )

    async def apply_output_settings(self) -> None:
        await self._app._task_manager.apply_output_settings(self._settings.output)

    def apply_logging_settings(self) -> None:
        configure_logger(
            self._settings.logging.log_dir,
            console_log_level=self._settings.logging.console_log_level,
            backup_count=self._settings.logging.backup_count,
        )

    def apply_bili_api_settings(self) -> None:
        self._app._task_manager.apply_bili_api_settings(self._settings.bili_api)

    async def apply_header_settings(self) -> None:
        await self._app._task_manager.apply_header_settings(self._settings.header)

    def apply_recorder_settings(self) -> None:
        self._app._task_manager.apply_recorder_settings(self._settings.recorder)

    def apply_postprocessing_settings(self) -> None:
        self._app._task_manager.apply_postprocessing_settings(
            self._settings.postprocessing
        )

    def apply_space_settings(self) -> None:
        self.apply_space_monitor_settings()
        self.apply_space_reclaimer_settings()

    def apply_space_monitor_settings(self) -> None:
        self._app._space_monitor.apply_settings(self._settings.space)

    def apply_space_reclaimer_settings(self) -> None:
        self._app._space_reclaimer.apply_settings(self._settings.space)

    def apply_email_notification_settings(self) -> None:
        self._apply_email_settings(self._app._email_service)
        self._apply_notifier_settings(
            self._app._email_service, self._settings.email_notification
        )
        self._apply_notification_settings(
            self._app._email_service, self._settings.email_notification
        )
        self._apply_message_template_settings(
            self._app._email_service, self._settings.email_notification
        )

    def apply_serverchan_notification_settings(self) -> None:
        self._apply_serverchan_settings(self._app._serverchan_service)
        self._apply_notifier_settings(
            self._app._serverchan_service, self._settings.serverchan_notification
        )
        self._apply_notification_settings(
            self._app._serverchan_service, self._settings.serverchan_notification
        )
        self._apply_message_template_settings(
            self._app._serverchan_service, self._settings.serverchan_notification
        )

    def apply_pushdeer_notification_settings(self) -> None:
        self._apply_pushdeer_settings(self._app._pushdeer_service)
        self._apply_notifier_settings(
            self._app._pushdeer_service, self._settings.pushdeer_notification
        )
        self._apply_notification_settings(
            self._app._pushdeer_service, self._settings.pushdeer_notification
        )
        self._apply_message_template_settings(
            self._app._pushdeer_service, self._settings.pushdeer_notification
        )

    def apply_pushplus_notification_settings(self) -> None:
        self._apply_pushplus_settings(self._app._pushplus_service)
        self._apply_notifier_settings(
            self._app._pushplus_service, self._settings.pushplus_notification
        )
        self._apply_notification_settings(
            self._app._pushplus_service, self._settings.pushplus_notification
        )
        self._apply_message_template_settings(
            self._app._pushplus_service, self._settings.pushplus_notification
        )

    def apply_telegram_notification_settings(self) -> None:
        self._apply_telegram_settings(self._app._telegram_service)
        self._apply_notifier_settings(
            self._app._telegram_service, self._settings.telegram_notification
        )
        self._apply_notification_settings(
            self._app._telegram_service, self._settings.telegram_notification
        )
        self._apply_message_template_settings(
            self._app._telegram_service, self._settings.telegram_notification
        )

    def apply_bark_notification_settings(self) -> None:
        self._apply_bark_settings(self._app._bark_service)
        self._apply_notifier_settings(
            self._app._bark_service, self._settings.bark_notification
        )
        self._apply_notification_settings(
            self._app._bark_service, self._settings.bark_notification
        )
        self._apply_message_template_settings(
            self._app._bark_service, self._settings.bark_notification
        )

    def apply_webhooks_settings(self) -> None:
        self._app._webhook_manager.apply_settings(self._settings.webhooks)

    def _apply_email_settings(self, email_service: EmailService) -> None:
        email_service.apply_settings(self._settings.email_notification)

    def _apply_serverchan_settings(self, serverchan: Serverchan) -> None:
        serverchan.apply_settings(self._settings.serverchan_notification)

    def _apply_pushdeer_settings(self, pushdeer: Pushdeer) -> None:
        pushdeer.apply_settings(self._settings.pushdeer_notification)

    def _apply_pushplus_settings(self, pushplus: Pushplus) -> None:
        pushplus.apply_settings(self._settings.pushplus_notification)

    def _apply_telegram_settings(self, telegram: Telegram) -> None:
        telegram.apply_settings(self._settings.telegram_notification)

    def _apply_bark_settings(self, bark: Bark) -> None:
        bark.apply_settings(self._settings.bark_notification)

    def _apply_notifier_settings(
        self, notifier: Notifier, settings: NotifierSettings
    ) -> None:
        notifier.apply_settings(settings)

    def _apply_notification_settings(
        self, notifier: Notifier, settings: NotificationSettings
    ) -> None:
        notifier.apply_settings(settings)

    def _apply_message_template_settings(
        self, notifier: Notifier, settings: MessageTemplateSettings
    ) -> None:
        notifier.apply_settings(settings)
