import { MediaItem } from '../models/media-item';
import { SessionQueueItem } from '../models/session-queue-item';
import { CleanupMode, ReviewStatus } from '../types/cleanup';

export interface QueueEngineInput {
  mediaItems: MediaItem[];
  selectedFolderBucketIds: string[];
  reviewStatusByMediaId: Record<string, ReviewStatus | undefined>;
  nowMs?: number;
  newWindowDays?: number;
}

export interface QueueEngine {
  getQueue(mode: CleanupMode, input: QueueEngineInput): SessionQueueItem[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_NEW_WINDOW_DAYS = 30;

export class CleanupQueueEngine implements QueueEngine {
  getQueue(mode: CleanupMode, input: QueueEngineInput): SessionQueueItem[] {
    const nowMs = input.nowMs ?? Date.now();
    const windowDays = input.newWindowDays ?? DEFAULT_NEW_WINDOW_DAYS;
    const minDateForNew = nowMs - windowDays * DAY_MS;

    const selectedFolderSet = new Set(input.selectedFolderBucketIds);

    return input.mediaItems
      .filter((item) => selectedFolderSet.has(item.folderBucketId))
      .filter((item) => (input.reviewStatusByMediaId[item.mediaStoreId] ?? 'pending') === 'pending')
      .filter((item) => (mode === 'new' ? item.dateTaken >= minDateForNew : item.dateTaken < minDateForNew))
      .sort((a, b) => (mode === 'new' ? b.dateTaken - a.dateTaken : a.dateTaken - b.dateTaken))
      .map((item) => ({
        mediaStoreId: item.mediaStoreId,
        uri: item.uri,
        dateTaken: item.dateTaken,
        folderBucketId: item.folderBucketId,
        mode,
      }));
  }
}
