import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { interval, of, Subscription, zip } from 'rxjs';
import { catchError, concatAll, switchMap } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { retry } from 'src/app/shared/rx-operators';
import { TaskService } from '../shared/services/task.service';
import {
  TaskData,
  VideoFileDetail,
} from '../shared/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  roomId!: number;
  taskData!: TaskData;
  videoFileDetails: VideoFileDetail[] = [];

  loading: boolean = true;
  private dataSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private notification: NzNotificationService,
    private taskService: TaskService
  ) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncData();
      } else {
        this.desyncData();
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = parseInt(params.get('id')!);
      this.syncData();
    });
  }

  ngOnDestroy(): void {
    this.desyncData();
  }

  private syncData(): void {
    this.dataSubscription = of(of(0), interval(1000))
      .pipe(
        concatAll(),
        switchMap(() =>
          zip(
            this.taskService.getTaskData(this.roomId),
            this.taskService.getVideoFileDetails(this.roomId)
          )
        ),
        catchError((error: HttpErrorResponse) => {
          this.notification.error('获取任务数据出错', error.message);
          throw error;
        }),
        retry(10, 3000)
      )
      .subscribe(
        ([taskData, videoFileDetails]) => {
          this.loading = false;
          this.taskData = taskData;
          this.videoFileDetails = videoFileDetails;
          this.changeDetector.markForCheck();
        },
        (error: HttpErrorResponse) => {
          this.notification.error(
            '获取任务数据出错',
            '网络连接异常, 请待网络正常后刷新。',
            { nzDuration: 0 }
          );
        }
      );
  }

  private desyncData(): void {
    this.dataSubscription?.unsubscribe();
  }
}
