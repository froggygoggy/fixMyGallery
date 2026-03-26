import { SessionQueueItem } from '../models/session-queue-item';
import { SessionQueueOrdering } from '../models/session-queue-ordering';
import { AppStateRepository } from '../repositories/app-state-repository';
import { MutableCleanupRepository } from '../repositories/mutable-cleanup-repository';
import { MediaScannerService } from '../services/media-scanner-service';
import { StartSessionUseCase } from './start-session-use-case';

export interface BootstrapUiSessionInput {
  selectedFolderBucketIds: string[];
  mode: 'old' | 'new';
  nowMs: number;
  newWindowDays: number;
  ordering?: SessionQueueOrdering;
}

export interface BootstrapUiSessionResult {
  queue: SessionQueueItem[];
  recommendedFolderBucketIds: string[];
  scannedMediaCount: number;
}

export class BootstrapUiSessionUseCase {
  private readonly startSessionUseCase: StartSessionUseCase;

  constructor(
    private readonly cleanupRepository: MutableCleanupRepository,
    private readonly appStateRepository: AppStateRepository,
    private readonly mediaScannerService: MediaScannerService,
  ) {
    this.startSessionUseCase = new StartSessionUseCase(cleanupRepository);
  }

  async execute(input: BootstrapUiSessionInput): Promise<BootstrapUiSessionResult> {
    const scannedMediaItems = await this.mediaScannerService.scanMediaForSelectedFolders(input.selectedFolderBucketIds);
    await this.cleanupRepository.saveMediaItems(scannedMediaItems);

    const folderUsage = await this.appStateRepository.loadFolderUsage();
    const session = await this.startSessionUseCase.execute({
      mode: input.mode,
      selectedFolderBucketIds: input.selectedFolderBucketIds,
      folderUsage,
      nowMs: input.nowMs,
      newWindowDays: input.newWindowDays,
      ordering: input.ordering,
    });

    return {
      queue: session.queue,
      recommendedFolderBucketIds: session.recommendedFolderBucketIds,
      scannedMediaCount: scannedMediaItems.length,
    };
  }
}
