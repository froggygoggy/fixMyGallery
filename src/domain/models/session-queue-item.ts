import { CleanupMode } from '../types/cleanup';

export interface SessionQueueItem {
  mediaStoreId: string;
  uri: string;
  dateTaken: number;
  folderBucketId: string;
  mode: CleanupMode;
}
