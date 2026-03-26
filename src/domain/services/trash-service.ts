import { TrashEntry } from '../models/trash-entry';

export interface TrashConfig {
  restoreWindowDays?: number;
}

export class TrashService {
  constructor(private readonly config: TrashConfig = {}) {}

  createEntriesForDelete(input: {
    mediaStoreIds: string[];
    sourceFolderBucketId: string;
    deletedAtMs?: number;
  }): TrashEntry[] {
    const deletedAt = input.deletedAtMs ?? Date.now();
    const restoreBy =
      this.config.restoreWindowDays === undefined
        ? undefined
        : deletedAt + this.config.restoreWindowDays * 24 * 60 * 60 * 1000;

    return input.mediaStoreIds.map((mediaStoreId) => ({
      mediaStoreId,
      originalFolderBucketId: input.sourceFolderBucketId,
      deletedAt,
      restoreBy,
    }));
  }

  canRestore(entry: TrashEntry, nowMs: number = Date.now()): boolean {
    if (entry.restoreBy === undefined) {
      return true;
    }

    return nowMs <= entry.restoreBy;
  }
}
