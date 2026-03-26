import { DEFAULT_REVIEWED_PHOTO_TAG } from '../models/photo-tag';
import { ReviewState } from '../models/review-state';
import { MutableCleanupRepository } from '../repositories/mutable-cleanup-repository';

export interface RecordReviewActionInput {
  mediaStoreIds: string[];
  action: 'processed' | 'moved' | 'deleted';
  sourceFolderId?: string;
  targetFolderId?: string;
  timestampMs: number;
  reviewTag?: string;
}

export class RecordReviewActionUseCase {
  constructor(private readonly cleanupRepository: MutableCleanupRepository) {}

  async execute(input: RecordReviewActionInput): Promise<ReviewState[]> {
    const reviewTag = input.reviewTag ?? DEFAULT_REVIEWED_PHOTO_TAG;

    const reviewStates: ReviewState[] = input.mediaStoreIds.map((mediaStoreId) => ({
      mediaStoreId,
      status: input.action,
      processedAt: input.timestampMs,
      sourceFolderId: input.sourceFolderId,
      targetFolderId: input.targetFolderId,
      reviewTag,
    }));

    await this.cleanupRepository.upsertReviewStates(reviewStates);
    return reviewStates;
  }
}
