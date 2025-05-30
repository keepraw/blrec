import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { SharedModule } from '../shared/shared.module';
import { SettingsResolver } from './shared/services/settings.resolver';
import { EmailNotificationSettingsResolver } from './shared/services/email-notification-settings.resolver';
import { ServerchanNotificationSettingsResolver } from './shared/services/serverchan-notification-settings.resolver';
import { PushdeerNotificationSettingsResolver } from './shared/services/pushdeer-notification-settings.resolver';
import { PushplusNotificationSettingsResolver } from './shared/services/pushplus-notification-settings.resolver';
import { TelegramNotificationSettingsResolver } from './shared/services/telegram-notification-settings.resolver';
import { WebhookSettingsResolver } from './shared/services/webhook-settings.resolver';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SwitchActionableDirective } from './shared/directives/switch-actionable.directive';
import { BaseUrlValidatorDirective } from './shared/directives/base-url-validator.directive';
import { DiskSpaceSettingsComponent } from './disk-space-settings/disk-space-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { LoggingSettingsComponent } from './logging-settings/logging-settings.component';
import { PostProcessingSettingsComponent } from './post-processing-settings/post-processing-settings.component';
import { RecorderSettingsComponent } from './recorder-settings/recorder-settings.component';
import { HeaderSettingsComponent } from './header-settings/header-settings.component';
import { UserAgentEditDialogComponent } from './header-settings/user-agent-edit-dialog/user-agent-edit-dialog.component';
import { CookieEditDialogComponent } from './header-settings/cookie-edit-dialog/cookie-edit-dialog.component';
import { OutputSettingsComponent } from './output-settings/output-settings.component';
import { WebhookSettingsComponent } from './webhook-settings/webhook-settings.component';
import { EventSettingsComponent } from './notification-settings/shared/components/event-settings/event-settings.component';
import { EmailNotificationSettingsComponent } from './notification-settings/email-notification-settings/email-notification-settings.component';
import { EmailSettingsComponent } from './notification-settings/email-notification-settings/email-settings/email-settings.component';
import { ServerchanNotificationSettingsComponent } from './notification-settings/serverchan-notification-settings/serverchan-notification-settings.component';
import { ServerchanSettingsComponent } from './notification-settings/serverchan-notification-settings/serverchan-settings/serverchan-settings.component';
import { PushdeerNotificationSettingsComponent } from './notification-settings/pushdeer-notification-settings/pushdeer-notification-settings.component';
import { PushdeerSettingsComponent } from './notification-settings/pushdeer-notification-settings/pushdeer-settings/pushdeer-settings.component';
import { PushplusNotificationSettingsComponent } from './notification-settings/pushplus-notification-settings/pushplus-notification-settings.component';
import { PushplusSettingsComponent } from './notification-settings/pushplus-notification-settings/pushplus-settings/pushplus-settings.component';
import { TelegramNotificationSettingsComponent } from './notification-settings/telegram-notification-settings/telegram-notification-settings.component';
import { TelegramSettingsComponent } from './notification-settings/telegram-notification-settings/telegram-settings/telegram-settings.component';
import { NotifierSettingsComponent } from './notification-settings/shared/components/notifier-settings/notifier-settings.component';
import { WebhookManagerComponent } from './webhook-settings/webhook-manager/webhook-manager.component';
import { WebhookEditDialogComponent } from './webhook-settings/webhook-edit-dialog/webhook-edit-dialog.component';
import { WebhookListComponent } from './webhook-settings/webhook-list/webhook-list.component';
import { OutdirEditDialogComponent } from './output-settings/outdir-edit-dialog/outdir-edit-dialog.component';
import { LogdirEditDialogComponent } from './logging-settings/logdir-edit-dialog/logdir-edit-dialog.component';
import { PathTemplateEditDialogComponent } from './output-settings/path-template-edit-dialog/path-template-edit-dialog.component';
import { MessageTemplateSettingsComponent } from './notification-settings/shared/components/message-template-settings/message-template-settings.component';
import { MessageTemplateEditDialogComponent } from './notification-settings/shared/components/message-template-settings/message-template-edit-dialog/message-template-edit-dialog.component';
import { BiliApiSettingsComponent } from './bili-api-settings/bili-api-settings.component';
import { BaseApiUrlEditDialogComponent } from './bili-api-settings/base-api-url-edit-dialog/base-api-url-edit-dialog.component';
import { BaseLiveApiUrlEditDialogComponent } from './bili-api-settings/base-live-api-url-edit-dialog/base-live-api-url-edit-dialog.component';
import { BasePlayInfoApiUrlEditDialogComponent } from './bili-api-settings/base-play-info-api-url-edit-dialog/base-play-info-api-url-edit-dialog.component';
import { BarkNotificationSettingsComponent } from './notification-settings/bark-notification-settings/bark-notification-settings.component';
import { BarkSettingsComponent } from './notification-settings/bark-notification-settings/bark-settings/bark-settings.component';
import { BarkNotificationSettingsResolver } from './shared/services/bark-notification-settings.resolver';

@NgModule({
  declarations: [
    SettingsComponent,
    SwitchActionableDirective,
    BaseUrlValidatorDirective,
    DiskSpaceSettingsComponent,
    NotificationSettingsComponent,
    LoggingSettingsComponent,
    PostProcessingSettingsComponent,
    RecorderSettingsComponent,
    HeaderSettingsComponent,
    UserAgentEditDialogComponent,
    CookieEditDialogComponent,
    OutputSettingsComponent,
    WebhookSettingsComponent,
    EventSettingsComponent,
    EmailNotificationSettingsComponent,
    EmailSettingsComponent,
    ServerchanNotificationSettingsComponent,
    ServerchanSettingsComponent,
    PushdeerNotificationSettingsComponent,
    PushdeerSettingsComponent,
    PushplusNotificationSettingsComponent,
    PushplusSettingsComponent,
    TelegramNotificationSettingsComponent,
    TelegramSettingsComponent,
    BarkNotificationSettingsComponent,
    BarkSettingsComponent,
    NotifierSettingsComponent,
    WebhookManagerComponent,
    WebhookEditDialogComponent,
    WebhookListComponent,
    OutdirEditDialogComponent,
    LogdirEditDialogComponent,
    PathTemplateEditDialogComponent,
    MessageTemplateSettingsComponent,
    MessageTemplateEditDialogComponent,
    BiliApiSettingsComponent,
    BaseApiUrlEditDialogComponent,
    BaseLiveApiUrlEditDialogComponent,
    BasePlayInfoApiUrlEditDialogComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    NzSpinModule,
    NzPageHeaderModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSliderModule,
    NzSelectModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzListModule,
    NzDropDownModule,
    NzToolTipModule,
    NzDividerModule,
    NzTableModule,
    NzCollapseModule,

    SharedModule,
  ],
  providers: [
    SettingsResolver,
    EmailNotificationSettingsResolver,
    ServerchanNotificationSettingsResolver,
    PushdeerNotificationSettingsResolver,
    PushplusNotificationSettingsResolver,
    TelegramNotificationSettingsResolver,
    BarkNotificationSettingsResolver,
    WebhookSettingsResolver,
  ],
})
export class SettingsModule { }
