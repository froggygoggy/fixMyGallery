import { AppStateRepository } from '../repositories/app-state-repository';
import { TrashService } from '../services/trash-service';

export interface RestoreFromTrashInput {
  mediaStoreIds: string[];
  now: Date;
}

export interface RestoreFromTrashResult {
  restoredCount: number;
  skippedCount: number;
  remainingTrashCount: number;
}

export class RestoreFromTrashUseCase {
  constructor(
    private readonly appStateRepository: AppStateRepository,
    private readonly trashService: TrashService = new TrashService(),
  ) {}

  async execute(input: RestoreFromTrashInput): Promise<RestoreFromTrashResult> {
    const allEntries = await this.appStateRepository.loadTrashEntries();
    const wanted = new Set(input.mediaStoreIds);

    const restoreCandidates = allEntries.filter((entry) => wanted.has(entry.mediaStoreId));
    const restorable = restoreCandidates.filter((entry) => this.trashService.canRestore(entry, input.now.getTime()));

    const removedCount = await this.appStateRepository.removeTrashEntries(restorable.map((entry) => entry.mediaStoreId));

    if (removedCount > 0) {
      await this.appStateRepository.appendUndoHistoryEntry({
        id: `${input.now.getTime()}-restore`,
        operationType: 'restore_from_trash',
        mediaStoreIds: restorable.map((entry) => entry.mediaStoreId),
        sourceFolderBucketId: restorable[0]?.originalFolderBucketId,
        createdAt: input.now.getTime(),
      });
    }

    const remainingTrash = await this.appStateRepository.loadTrashEntries();

    return {
      restoredCount: removedCount,
      skippedCount: restoreCandidates.length - removedCount,
      remainingTrashCount: remainingTrash.length,
    };
  }
}
