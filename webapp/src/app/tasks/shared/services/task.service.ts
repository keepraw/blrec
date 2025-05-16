import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UrlService } from 'src/app/core/services/url.service';
import { ResponseMessage } from '../../../shared/api.models';
import {
  TaskData,
  DataSelection,
  TaskParam,
  Metadata,
  StreamProfile,
  AddTaskResult,
  VideoFileDetail,
  DanmakuFileDetail,
  TaskSettings,
  TaskOptions,
} from '../task.model';
import { ApiUrlService } from '../../../shared/services/api-url.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private http: HttpClient,
    private url: ApiUrlService
  ) {}

  getAllTaskData(
    select: DataSelection = DataSelection.ALL
  ): Observable<TaskData[]> {
    const url = this.url.makeApiUrl('/api/v1/tasks/data');
    return this.http.get<TaskData[]>(url, { params: { select } });
  }

  getTaskData(roomId: number): Observable<TaskData> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}`);
    return this.http.get<TaskData>(url);
  }

  getVideoFileDetails(roomId: number): Observable<VideoFileDetail[]> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/videos`);
    return this.http.get<VideoFileDetail[]>(url);
  }

  getTaskSettings(roomId: number): Observable<TaskSettings> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/settings`);
    return this.http.get<TaskSettings>(url);
  }

  getTaskParam(roomId: number): Observable<TaskParam> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/param`);
    return this.http.get<TaskParam>(url);
  }

  getMetadata(roomId: number): Observable<Metadata | null> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/metadata`);
    return this.http.get<Metadata | null>(url);
  }

  getStreamProfile(roomId: number): Observable<StreamProfile> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/profile`);
    return this.http.get<StreamProfile>(url);
  }

  updateAllTaskInfos(): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl('/api/v1/tasks/info');
    return this.http.post<ResponseMessage>(url, null);
  }

  updateTaskInfo(roomId: number): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/info`);
    return this.http.post<ResponseMessage>(url, null);
  }

  updateTaskSettings(
    roomId: number,
    options: TaskOptions
  ): Observable<TaskSettings> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/settings`);
    return this.http.patch<TaskSettings>(url, options);
  }

  addTask(roomId: number): Observable<AddTaskResult> {
    const url = this.url.makeApiUrl('/api/v1/tasks');
    return this.http.post<AddTaskResult>(url, { room_id: roomId });
  }

  removeTask(roomId: number): Observable<void> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}`);
    return this.http.delete<void>(url);
  }

  removeAllTasks(): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl('/api/v1/tasks');
    return this.http.delete<ResponseMessage>(url);
  }

  startTask(roomId: number): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/start`);
    return this.http.post<ResponseMessage>(url, null);
  }

  startAllTasks(): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/start`);
    return this.http.post<ResponseMessage>(url, null);
  }

  stopTask(
    roomId: number,
    force: boolean = false,
    background: boolean = false
  ): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/stop`);
    return this.http.post<ResponseMessage>(url, { force, background });
  }

  stopAllTasks(
    force: boolean = false,
    background: boolean = false
  ): Observable<ResponseMessage> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/stop`);
    return this.http.post<ResponseMessage>(url, { force, background });
  }

  enableMonitor(roomId: number): Observable<void> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/monitor`);
    return this.http.post<void>(url, {});
  }

  disableMonitor(roomId: number): Observable<void> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/monitor`);
    return this.http.delete<void>(url);
  }

  enableRecorder(roomId: number): Observable<void> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/recorder`);
    return this.http.post<void>(url, {});
  }

  disableRecorder(roomId: number): Observable<void> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/recorder`);
    return this.http.delete<void>(url);
  }

  cutStream(roomId: number): Observable<void> {
    const url = this.url.makeApiUrl(`/api/v1/tasks/${roomId}/stream/cut`);
    return this.http.post<void>(url, {});
  }
}
