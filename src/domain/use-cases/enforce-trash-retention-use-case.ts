import { AppStateRepository } from '../repositories/app-state-repository';

export interface EnforceTrashRetentionResult {
  purgedCount: number;
  remainingCount: number;
}

export class EnforceTrashRetentionUseCase {
  constructor(private readonly appStateRepository: AppStateRepository) {}

  async execute(maxAgeDays: number, now: Date = new Date()): Promise<EnforceTrashRetentionResult> {
    const all = await this.appStateRepository.loadTrashEntries();
    const cutoff = now.getTime() - Math.max(0, maxAgeDays) * 24 * 60 * 60 * 1000;

    const toPurge = all.filter((entry) => entry.deletedAt < cutoff).map((entry) => entry.mediaStoreId);
    const purgedCount = await this.appStateRepository.removeTrashEntries(toPurge);
    const remaining = await this.appStateRepository.loadTrashEntries();

    return {
      purgedCount,
      remainingCount: remaining.length,
    };
  }
}
