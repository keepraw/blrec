import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskSettings } from '../../models/task-settings.model';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {

  private getTaskSettings(): Observable<TaskSettings> {
    return this.settingService
      .getSettings([
        'output',
        'header',
        'recorder',
        'postprocessing',
      ])
      .pipe(
        map((settings) => ({
          output: settings.output,
          header: settings.header,
          recorder: settings.recorder,
          postprocessing: settings.postprocessing,
        }))
      );
  }

  constructor(private settingService: SettingService) { }

  ngOnInit(): void {
  }

} 