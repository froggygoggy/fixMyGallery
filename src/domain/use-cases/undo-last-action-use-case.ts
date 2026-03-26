import { AppStateRepository } from '../repositories/app-state-repository';

export interface UndoLastActionResult {
  undone: boolean;
  operationType?: string;
  restoredFromTrashCount?: number;
}

export class UndoLastActionUseCase {
  constructor(private readonly appStateRepository: AppStateRepository) {}

  async execute(): Promise<UndoLastActionResult> {
    const entry = await this.appStateRepository.popLastUndoHistoryEntry();

    if (!entry) {
      return { undone: false };
    }

    if (entry.operationType === 'restore_from_trash') {
      const removed = await this.appStateRepository.removeTrashEntries(entry.mediaStoreIds);
      return {
        undone: true,
        operationType: entry.operationType,
        restoredFromTrashCount: removed,
      };
    }

    return {
      undone: true,
      operationType: entry.operationType,
      restoredFromTrashCount: 0,
    };
  }
}
