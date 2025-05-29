import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsResolver } from './shared/services/settings.resolver';
import { EmailNotificationSettingsResolver } from './shared/services/email-notification-settings.resolver';
import { PushplusNotificationSettingsResolver } from './shared/services/pushplus-notification-settings.resolver';
import { TelegramNotificationSettingsResolver } from './shared/services/telegram-notification-settings.resolver';
import { ServerchanNotificationSettingsResolver } from './shared/services/serverchan-notification-settings.resolver';
import { PushdeerNotificationSettingsResolver } from './shared/services/pushdeer-notification-settings.resolver';
import { BarkNotificationSettingsResolver } from './shared/services/bark-notification-settings.resolver';
import { WebhookSettingsResolver } from './shared/services/webhook-settings.resolver';
import { SettingsComponent } from './settings.component';
import { EmailNotificationSettingsComponent } from './notification-settings/email-notification-settings/email-notification-settings.component';
import { ServerchanNotificationSettingsComponent } from './notification-settings/serverchan-notification-settings/serverchan-notification-settings.component';
import { PushdeerNotificationSettingsComponent } from './notification-settings/pushdeer-notification-settings/pushdeer-notification-settings.component';
import { PushplusNotificationSettingsComponent } from './notification-settings/pushplus-notification-settings/pushplus-notification-settings.component';
import { TelegramNotificationSettingsComponent } from './notification-settings/telegram-notification-settings/telegram-notification-settings.component';
import { BarkNotificationSettingsComponent } from './notification-settings/bark-notification-settings/bark-notification-settings.component';
import { WebhookManagerComponent } from './webhook-settings/webhook-manager/webhook-manager.component';

const routes: Routes = [
  {
    path: 'email-notification',
    component: EmailNotificationSettingsComponent,
    resolve: {
      settings: EmailNotificationSettingsResolver,
    },
  },
  {
    path: 'serverchan-notification',
    component: ServerchanNotificationSettingsComponent,
    resolve: {
      settings: ServerchanNotificationSettingsResolver,
    },
  },
  {
    path: 'pushdeer-notification',
    component: PushdeerNotificationSettingsComponent,
    resolve: {
      settings: PushdeerNotificationSettingsResolver,
    },
  },
  {
    path: 'pushplus-notification',
    component: PushplusNotificationSettingsComponent,
    resolve: {
      settings: PushplusNotificationSettingsResolver,
    },
  },
  {
    path: 'telegram-notification',
    component: TelegramNotificationSettingsComponent,
    resolve: {
      settings: TelegramNotificationSettingsResolver,
    },
  },
  {
    path: 'bark-notification',
    component: BarkNotificationSettingsComponent,
    resolve: {
      settings: BarkNotificationSettingsResolver,
    },
  },
  {
    path: 'webhooks',
    component: WebhookManagerComponent,
    resolve: {
      settings: WebhookSettingsResolver,
    },
  },
  {
    path: '',
    component: SettingsComponent,
    resolve: {
      settings: SettingsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {} 