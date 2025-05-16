import { Nullable } from '../../shared/types';

export interface OutputSettings {
  outDir: string;
  pathTemplate: string;
  filesizeLimit: number;
  durationLimit: number;
}

export type OutputOptions = Nullable<OutputSettings>;

export interface BiliApiSettings {
  baseApiUrls: string[];
  baseLiveApiUrls: string[];
  basePlayInfoApiUrls: string[];
}

export type BiliApiOptions = Nullable<BiliApiSettings>;

export interface HeaderSettings {
  userAgent: string;
  cookie: string;
}

export type HeaderOptions = Nullable<HeaderSettings>;

export interface RecorderSettings {
  streamFormat: StreamFormat;
  recordingMode: RecordingMode;
  qualityNumber: QualityNumber;
  readTimeout: number;
  disconnectionTimeout: number;
  bufferSize: number;
  saveCover: boolean;
  coverSaveStrategy: CoverSaveStrategy;
}

export type RecorderOptions = Nullable<RecorderSettings>;

export interface PostprocessingSettings {
  remuxToMp4: boolean;
  injectExtraMetadata: boolean;
  deleteSource: DeleteStrategy;
}

export type PostprocessingOptions = Nullable<PostprocessingSettings>;

export interface Settings {
  output: OutputSettings;
  biliApi: BiliApiSettings;
  header: HeaderSettings;
  recorder: RecorderSettings;
  postprocessing: PostprocessingSettings;
}

export interface Options {
  output: OutputOptions;
  biliApi: BiliApiOptions;
  header: HeaderOptions;
  recorder: RecorderOptions;
  postprocessing: PostprocessingOptions;
}

export type SettingSection =
  | 'output'
  | 'biliApi'
  | 'header'
  | 'recorder'
  | 'postprocessing';

export interface WebhookSettings {
  enabled: boolean;
  url: string;
  method: string;
  headers: { [key: string]: string };
  events: {
    liveBegan: boolean;
    liveEnded: boolean;
    roomChange: boolean;
    recordingStarted: boolean;
    recordingFinished: boolean;
    recordingCancelled: boolean;
    videoFileCreated: boolean;
    videoFileCompleted: boolean;
    coverImageDownloaded: boolean;
    videoPostprocessingCompleted: boolean;
    postprocessingCompleted: boolean;
    spaceNoEnough: boolean;
  };
}

export interface WebhookOptions {
  enabled: boolean | null;
  url: string | null;
  method: string | null;
  headers: { [key: string]: string } | null;
  events: {
    liveBegan: boolean | null;
    liveEnded: boolean | null;
    roomChange: boolean | null;
    recordingStarted: boolean | null;
    recordingFinished: boolean | null;
    recordingCancelled: boolean | null;
    videoFileCreated: boolean | null;
    videoFileCompleted: boolean | null;
    coverImageDownloaded: boolean | null;
    videoPostprocessingCompleted: boolean | null;
    postprocessingCompleted: boolean | null;
    spaceNoEnough: boolean | null;
  };
}

export interface SpaceSettings {
  threshold: number;
  checkInterval: number;
}

export type SpaceOptions = Nullable<SpaceSettings>;

export interface GlobalSettings {
  output: OutputSettings;
  biliApi: BiliApiSettings;
  header: HeaderSettings;
  recorder: RecorderSettings;
  postprocessing: PostprocessingSettings;
  webhook: WebhookSettings;
  space: SpaceSettings;
}

export interface GlobalOptions {
  output: OutputOptions;
  biliApi: BiliApiOptions;
  header: HeaderOptions;
  recorder: RecorderOptions;
  postprocessing: PostprocessingOptions;
  webhook: WebhookOptions;
  space: SpaceOptions;
}

export type StreamFormat = 'flv' | 'fmp4';

export type RecordingMode = 'standard' | 'realtime';

export type QualityNumber = 10000 | 250 | 400 | 1000 | 2000 | 4000 | 8000;

export type CoverSaveStrategy = 'default' | 'append' | 'overwrite';

export type DeleteStrategy = 'auto' | 'safe' | 'never';
