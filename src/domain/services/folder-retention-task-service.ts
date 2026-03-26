import { FolderRetentionRule, FolderRetentionTask } from '../models/folder-retention-rule';
import { MediaItem } from '../models/media-item';
import { ReviewState } from '../models/review-state';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface FolderRetentionTaskInput {
  rules: FolderRetentionRule[];
  mediaItems: MediaItem[];
  reviewStates: ReviewState[];
  nowMs: number;
}

export class FolderRetentionTaskService {
  buildTasks(input: FolderRetentionTaskInput): FolderRetentionTask[] {
    const reviewById = new Map(input.reviewStates.map((item) => [item.mediaStoreId, item.status]));

    return input.rules
      .filter((rule) => rule.enabled && rule.minAgeDays > 0)
      .map((rule) => {
        const minDate = input.nowMs - rule.minAgeDays * DAY_MS;
        const candidateMediaStoreIds = input.mediaItems
          .filter((item) => item.folderBucketId === rule.folderBucketId)
          .filter((item) => item.dateTaken <= minDate)
          .filter((item) => (reviewById.get(item.mediaStoreId) ?? 'pending') === 'pending')
          .map((item) => item.mediaStoreId);

        return {
          folderBucketId: rule.folderBucketId,
          minAgeDays: rule.minAgeDays,
          candidateMediaStoreIds,
        };
      })
      .filter((task) => task.candidateMediaStoreIds.length > 0);
  }
}
