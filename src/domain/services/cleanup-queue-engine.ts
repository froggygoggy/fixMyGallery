import { MediaItem } from '../models/media-item';
import { SessionQueueOrdering } from '../models/session-queue-ordering';
import { SessionQueueItem } from '../models/session-queue-item';
import { CleanupMode, ReviewStatus } from '../types/cleanup';

export interface QueueEngineInput {
  mediaItems: MediaItem[];
  selectedFolderBucketIds: string[];
  reviewStatusByMediaId: Record<string, ReviewStatus | undefined>;
  nowMs?: number;
  newWindowDays?: number;
  ordering?: SessionQueueOrdering;
}

export interface QueueEngine {
  getQueue(mode: CleanupMode, input: QueueEngineInput): SessionQueueItem[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_NEW_WINDOW_DAYS = 30;

function dayMonthKey(timestampMs: number): number {
  const d = new Date(timestampMs);
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return month * 100 + day;
}

function resolveOrdering(mode: CleanupMode, ordering?: SessionQueueOrdering): SessionQueueOrdering {
  if (ordering) {
    return ordering;
  }

  return mode === 'new' ? 'chronological_desc' : 'chronological_asc';
}

export class CleanupQueueEngine implements QueueEngine {
  getQueue(mode: CleanupMode, input: QueueEngineInput): SessionQueueItem[] {
    const nowMs = input.nowMs ?? Date.now();
    const windowDays = input.newWindowDays ?? DEFAULT_NEW_WINDOW_DAYS;
    const minDateForNew = nowMs - windowDays * DAY_MS;
    const ordering = resolveOrdering(mode, input.ordering);

    const selectedFolderSet = new Set(input.selectedFolderBucketIds);

    return input.mediaItems
      .filter((item) => selectedFolderSet.has(item.folderBucketId))
      .filter((item) => (input.reviewStatusByMediaId[item.mediaStoreId] ?? 'pending') === 'pending')
      .filter((item) => (mode === 'new' ? item.dateTaken >= minDateForNew : item.dateTaken < minDateForNew))
      .sort((a, b) => {
        if (ordering === 'chronological_desc') {
          return b.dateTaken - a.dateTaken;
        }

        if (ordering === 'day_month') {
          const keyA = dayMonthKey(a.dateTaken);
          const keyB = dayMonthKey(b.dateTaken);

          if (keyA !== keyB) {
            return keyA - keyB;
          }
        }

        return a.dateTaken - b.dateTaken;
      })
      .map((item) => ({
        mediaStoreId: item.mediaStoreId,
        uri: item.uri,
        dateTaken: item.dateTaken,
        folderBucketId: item.folderBucketId,
        mode,
      }));
  }
}
