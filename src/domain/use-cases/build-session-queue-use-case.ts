import { CleanupRepository } from '../repositories/cleanup-repository';
import { CleanupQueueEngine } from '../services/cleanup-queue-engine';
import { SessionQueueItem } from '../models/session-queue-item';
import { SessionQueueOrdering } from '../models/session-queue-ordering';
import { CleanupMode } from '../types/cleanup';

export interface BuildSessionQueueInput {
  mode: CleanupMode;
  selectedFolderBucketIds: string[];
  newWindowDays?: number;
  nowMs?: number;
  ordering?: SessionQueueOrdering;
}

export class BuildSessionQueueUseCase {
  constructor(
    private readonly repository: CleanupRepository,
    private readonly queueEngine: CleanupQueueEngine = new CleanupQueueEngine(),
  ) {}

  async execute(input: BuildSessionQueueInput): Promise<SessionQueueItem[]> {
    const mediaItems = await this.repository.getMediaItems();
    const reviewStates = await this.repository.getReviewStates();

    const reviewStatusByMediaId = Object.fromEntries(
      reviewStates.map((state) => [state.mediaStoreId, state.status]),
    );

    return this.queueEngine.getQueue(input.mode, {
      mediaItems,
      selectedFolderBucketIds: input.selectedFolderBucketIds,
      reviewStatusByMediaId,
      newWindowDays: input.newWindowDays,
      nowMs: input.nowMs,
      ordering: input.ordering,
    });
  }
}
