import { Pipe, PipeTransform } from '@angular/core';

import { VideoFileStatus } from 'src/app/tasks/shared/task.model';

const STATUS_MAPPING = new Map([
  [VideoFileStatus.RECORDING, '录制中'],
  [VideoFileStatus.INJECTING, '处理中'],
  [VideoFileStatus.REMUXING, '处理中'],
  [VideoFileStatus.COMPLETED, '已完成'],
  [VideoFileStatus.MISSING, '不存在'],
  [VideoFileStatus.UNKNOWN, '???'],
]);

@Pipe({
  name: 'filestatus',
})
export class FilestatusPipe implements PipeTransform {
  transform(status: VideoFileStatus): string {
    return STATUS_MAPPING.get(status) ?? '？？？';
  }
}
