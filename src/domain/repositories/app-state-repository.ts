import { OnboardingConfig } from '../models/onboarding-config';
import { PinnedSlot } from '../models/pinned-slot';
import { TrashEntry } from '../models/trash-entry';
import { UndoHistoryEntry } from '../models/undo-history-entry';
import { FolderUsage } from '../services/folder-recommendation-service';

export interface AppStateRepository {
  saveOnboardingConfig(config: OnboardingConfig): Promise<void>;
  loadOnboardingConfig(): Promise<OnboardingConfig | null>;

  savePinnedSlots(slots: PinnedSlot[]): Promise<void>;
  loadPinnedSlots(): Promise<PinnedSlot[]>;

  saveFolderUsage(usage: FolderUsage[]): Promise<void>;
  loadFolderUsage(): Promise<FolderUsage[]>;

  appendTrashEntries(entries: TrashEntry[]): Promise<void>;
  loadTrashEntries(): Promise<TrashEntry[]>;
  removeTrashEntries(mediaStoreIds: string[]): Promise<number>;

  appendUndoHistoryEntry(entry: UndoHistoryEntry): Promise<void>;
  loadUndoHistory(): Promise<UndoHistoryEntry[]>;
}
