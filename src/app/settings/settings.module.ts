import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { OutputSettingsComponent } from './output-settings/output-settings.component';
import { BiliApiSettingsComponent } from './bili-api-settings/bili-api-settings.component';
import { HeaderSettingsComponent } from './header-settings/header-settings.component';
import { RecorderSettingsComponent } from './recorder-settings/recorder-settings.component';
import { PostprocessingSettingsComponent } from './postprocessing-settings/postprocessing-settings.component';
import { LoggingSettingsComponent } from './logging-settings/logging-settings.component';
import { SpaceSettingsComponent } from './space-settings/space-settings.component';
import { WebhookSettingsComponent } from './webhook-settings/webhook-settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    OutputSettingsComponent,
    BiliApiSettingsComponent,
    HeaderSettingsComponent,
    RecorderSettingsComponent,
    PostprocessingSettingsComponent,
    LoggingSettingsComponent,
    SpaceSettingsComponent,
    WebhookSettingsComponent,
  ],
  imports: [CommonModule, SharedModule, SettingsRoutingModule],
})
export class SettingsModule {} 