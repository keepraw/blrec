import { ResponseMessage } from '../../shared/api.models';
import {
  DeleteStrategy,
  StreamFormat,
  QualityNumber,
  RecordingMode,
  CoverSaveStrategy,
} from '../../settings/shared/setting.model';

export interface Task {
  readonly room_id: number;
  readonly user_name: string;
  readonly title: string;
  readonly area_name: string;
  readonly parent_area_name: string;
  readonly live_status: LiveStatus;
  readonly record_status: RecordStatus;
  readonly auto_record: boolean;
  readonly stream_url: string;
  readonly stream_host: string;
  readonly stream_format: StreamFormat;
  readonly real_stream_format: StreamFormat | null;
  readonly quality_number: QualityNumber;
  readonly real_quality_number: QualityNumber | null;
  readonly out_dir: string;
  readonly path_template: string;
  readonly filesize_limit: number;
  readonly duration_limit: number;
  readonly save_cover: boolean;
  readonly cover_save_strategy: CoverSaveStrategy;
  readonly dl_total: number;
  readonly dl_rate: number;
  readonly rec_elapsed: number;
  readonly rec_total: number;
  readonly rec_rate: number;
}

export interface TaskSettings {
  readonly auto_record: boolean;
  readonly out_dir: string;
  readonly path_template: string;
  readonly stream_format: StreamFormat;
  readonly quality_number: QualityNumber;
  readonly filesize_limit: number;
  readonly duration_limit: number;
  readonly save_cover: boolean;
  readonly cover_save_strategy: CoverSaveStrategy;
}

export interface TaskOptions {
  readonly auto_record: boolean | null;
  readonly out_dir: string | null;
  readonly path_template: string | null;
  readonly stream_format: StreamFormat | null;
  readonly quality_number: QualityNumber | null;
  readonly filesize_limit: number | null;
  readonly duration_limit: number | null;
  readonly save_cover: boolean | null;
  readonly cover_save_strategy: CoverSaveStrategy | null;
}

export interface TaskStatus {
  readonly room_id: number;
  readonly user_name: string;
  readonly title: string;
  readonly area_name: string;
  readonly parent_area_name: string;
  readonly live_status: LiveStatus;
  readonly record_status: RecordStatus;
  readonly stream_url: string;
  readonly stream_host: string;
  readonly stream_format: StreamFormat;
  readonly real_stream_format: StreamFormat | null;
  readonly quality_number: QualityNumber;
  readonly real_quality_number: QualityNumber | null;
  readonly out_dir: string;
  readonly path_template: string;
  readonly filesize_limit: number;
  readonly duration_limit: number;
  readonly save_cover: boolean;
  readonly cover_save_strategy: CoverSaveStrategy;
  readonly dl_total: number;
  readonly dl_rate: number;
  readonly rec_elapsed: number;
  readonly rec_total: number;
  readonly rec_rate: number;
}

export interface TaskData {
  readonly task: Task;
  readonly status: TaskStatus;
}

export enum LiveStatus {
  PREPARING = 'PREPARING',
  LIVE = 'LIVE',
  ROUND = 'ROUND',
}

export enum RecordStatus {
  WAITING = 'WAITING',
  RECORDING = 'RECORDING',
  STOPPED = 'STOPPED',
}

export interface VideoFileDetail {
  readonly path: string;
  readonly size: number;
  readonly created_at: number;
  readonly status: VideoFileStatus;
}

export enum VideoFileStatus {
  RECORDING = 'RECORDING',
  COMPLETED = 'COMPLETED',
}

export interface FileDetail {
  readonly path: string;
  readonly size: number;
  readonly created_at: number;
  readonly status: VideoFileStatus;
}

export interface TaskParam {
  readonly out_dir: string;
  readonly path_template: string;
  readonly filesize_limit: number;
  readonly duration_limit: number;

  readonly user_agent: string;
  readonly cookie: string;

  readonly stream_format: StreamFormat;
  readonly recording_mode: RecordingMode;
  readonly quality_number: QualityNumber;
  readonly read_timeout: number;
  readonly disconnection_timeout: number;
  readonly buffer_size: number;
  readonly save_cover: boolean;

  readonly remux_to_mp4: boolean;
  readonly inject_extra_metadata: boolean;
  readonly delete_source: DeleteStrategy;
}

export interface VideoStreamProfile {
  index?: number;
  codec_name?: string;
  codec_long_name?: string;
  profile?: string;
  codec_type?: string;
  codec_tag_string?: string;
  codec_tag?: string;
  width?: number;
  height?: number;
  coded_width?: number;
  coded_height?: number;
  closed_captions?: number;
  film_grain?: number;
  has_b_frames?: number;
  pix_fmt?: string;
  level?: number;
  chroma_location?: string;
  field_order?: string;
  refs?: number;
  is_avc?: string;
  nal_length_size?: string;
  r_frame_rate?: string;
  avg_frame_rate?: string;
  time_base?: string;
  start_pts?: number;
  start_time?: string;
  bit_rate?: string;
  bits_per_raw_sample?: string;
  extradata_size?: number;
  disposition?: {
    default?: number;
    dub?: number;
    original?: number;
    comment?: number;
    lyrics?: number;
    karaoke?: number;
    forced?: number;
    hearing_impaired?: number;
    visual_impaired?: number;
    clean_effects?: number;
    attached_pic?: number;
    timed_thumbnails?: number;
    captions?: number;
    descriptions?: number;
    metadata?: number;
    dependent?: number;
    still_image?: number;
  };
  tags?: {
    language?: string;
    handler_name?: string;
    vendor_id?: string;
    encoder?: string;
  };
}

export interface AudioStreamProfile {
  index?: number;
  codec_name?: string;
  codec_long_name?: string;
  profile?: string;
  codec_type?: string;
  codec_tag_string?: string;
  codec_tag?: string;
  sample_fmt?: string;
  sample_rate?: string;
  channels?: number;
  channel_layout?: string;
  bits_per_sample?: number;
  r_frame_rate?: string;
  avg_frame_rate?: string;
  time_base?: string;
  start_pts?: number;
  start_time?: string;
  duration_ts?: number;
  duration?: string;
  bit_rate?: string;
  extradata_size?: number;
  disposition?: {
    default?: number;
    dub?: number;
    original?: number;
    comment?: number;
    lyrics?: number;
    karaoke?: number;
    forced?: number;
    hearing_impaired?: number;
    visual_impaired?: number;
    clean_effects?: number;
    attached_pic?: number;
    timed_thumbnails?: number;
    captions?: number;
    descriptions?: number;
    metadata?: number;
    dependent?: number;
    still_image?: number;
  };
}

export interface Metadata {
  hasAudio: boolean;
  hasVideo: boolean;
  hasMetadata: boolean;
  hasKeyframes: boolean;
  canSeekToEnd: boolean;
  duration: number;
  datasize: number;
  filesize: number;
  audiosize: number;
  audiocodecid: number;
  audiodatarate: number;
  audiosamplerate: 3;
  audiosamplesize: 1;
  stereo: boolean;
  videosize: number;
  framerate: number;
  videocodecid: 7;
  videodatarate: number;
  width: number;
  height: number;
  lasttimestamp: number;
  lastkeyframelocation: number;
  lastkeyframetimestamp: number;
  keyframes: {
    times: number[];
    filepositions: number[];
  };
}

export interface StreamProfile {
  streams?: [VideoStreamProfile, AudioStreamProfile];
  format?: {
    filename?: string;
    nb_streams?: number;
    nb_programs?: number;
    format_name?: string;
    format_long_name?: string;
    start_time?: string;
    duration?: string;
    probe_score?: number;
    tags?: {
      displayWidth?: string;
      displayHeight?: string;
      fps?: string;
      profile?: string;
      level?: string;
      videocodecreal?: string;
      cdn_ip?: string;
      Server?: string;
      Rawdata?: string;
      encoder?: string;
      string?: string;
      mau?: string;
      major_brand?: string;
      minor_version?: string;
      compatible_brands?: string;
    };
  };
}

export interface AddTaskResult extends ResponseMessage {
  data: {
    room_id: number;
  };
}
