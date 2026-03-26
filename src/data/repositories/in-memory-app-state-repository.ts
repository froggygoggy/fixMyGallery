import { OnboardingConfig } from '../../domain/models/onboarding-config';
import { PinnedSlot } from '../../domain/models/pinned-slot';
import { TrashEntry } from '../../domain/models/trash-entry';
import { UndoHistoryEntry } from '../../domain/models/undo-history-entry';
import { AppStateRepository } from '../../domain/repositories/app-state-repository';
import { FolderUsage } from '../../domain/services/folder-recommendation-service';

export class InMemoryAppStateRepository implements AppStateRepository {
  private onboardingConfig: OnboardingConfig | null = null;
  private pinnedSlots: PinnedSlot[] = [];
  private folderUsage: FolderUsage[] = [];
  private trashEntries: TrashEntry[] = [];
  private undoHistory: UndoHistoryEntry[] = [];

  async saveOnboardingConfig(config: OnboardingConfig): Promise<void> {
    this.onboardingConfig = config;
  }

  async loadOnboardingConfig(): Promise<OnboardingConfig | null> {
    return this.onboardingConfig;
  }

  async savePinnedSlots(slots: PinnedSlot[]): Promise<void> {
    this.pinnedSlots = [...slots];
  }

  async loadPinnedSlots(): Promise<PinnedSlot[]> {
    return [...this.pinnedSlots];
  }

  async saveFolderUsage(usage: FolderUsage[]): Promise<void> {
    this.folderUsage = [...usage];
  }

  async loadFolderUsage(): Promise<FolderUsage[]> {
    return [...this.folderUsage];
  }

  async appendTrashEntries(entries: TrashEntry[]): Promise<void> {
    this.trashEntries.push(...entries);
  }

  async loadTrashEntries(): Promise<TrashEntry[]> {
    return [...this.trashEntries];
  }

  async removeTrashEntries(mediaStoreIds: string[]): Promise<number> {
    const before = this.trashEntries.length;
    const removeSet = new Set(mediaStoreIds);
    this.trashEntries = this.trashEntries.filter((entry) => !removeSet.has(entry.mediaStoreId));
    return before - this.trashEntries.length;
  }

  async appendUndoHistoryEntry(entry: UndoHistoryEntry): Promise<void> {
    this.undoHistory.push(entry);
  }

  async loadUndoHistory(): Promise<UndoHistoryEntry[]> {
    return [...this.undoHistory];
  }
}
