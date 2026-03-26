import { CleanupRepository } from '../repositories/cleanup-repository';
import { BuildSessionQueueUseCase } from './build-session-queue-use-case';
import { CleanupMode } from '../types/cleanup';
import { SessionQueueItem } from '../models/session-queue-item';
import { FolderRecommendationService, FolderUsage } from '../services/folder-recommendation-service';

export interface StartSessionInput {
  mode: CleanupMode;
  selectedFolderBucketIds: string[];
  folderUsage: FolderUsage[];
  newWindowDays?: number;
  nowMs?: number;
  recommendationLimit?: number;
}

export interface StartSessionResult {
  queue: SessionQueueItem[];
  recommendedFolderBucketIds: string[];
  totalPendingCount: number;
}

export class StartSessionUseCase {
  private readonly queueUseCase: BuildSessionQueueUseCase;

  constructor(
    repository: CleanupRepository,
    private readonly folderRecommendationService: FolderRecommendationService = new FolderRecommendationService(),
  ) {
    this.queueUseCase = new BuildSessionQueueUseCase(repository);
  }

  async execute(input: StartSessionInput): Promise<StartSessionResult> {
    const queue = await this.queueUseCase.execute({
      mode: input.mode,
      selectedFolderBucketIds: input.selectedFolderBucketIds,
      newWindowDays: input.newWindowDays,
      nowMs: input.nowMs,
    });

    const recommendedFolderBucketIds = this.folderRecommendationService.recommend({
      availableFolderBucketIds: input.selectedFolderBucketIds,
      usage: input.folderUsage,
      limit: input.recommendationLimit,
    });

    return {
      queue,
      recommendedFolderBucketIds,
      totalPendingCount: queue.length,
    };
  }
}
