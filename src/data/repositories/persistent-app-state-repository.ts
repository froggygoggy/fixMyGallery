import { CreatedAlbum } from '../../domain/models/created-album';
import { OnboardingConfig } from '../../domain/models/onboarding-config';
import { PinnedSlot } from '../../domain/models/pinned-slot';
import { SessionCommandLogEntry } from '../../domain/models/session-command-log-entry';
import { TrashEntry } from '../../domain/models/trash-entry';
import { UndoHistoryEntry } from '../../domain/models/undo-history-entry';
import { AppStateRepository } from '../../domain/repositories/app-state-repository';
import { FolderUsage } from '../../domain/services/folder-recommendation-service';
import { KeyValueStore } from './key-value-store';

interface PersistentAppStateData {
  onboardingConfig: OnboardingConfig | null;
  pinnedSlots: PinnedSlot[];
  folderUsage: FolderUsage[];
  trashEntries: TrashEntry[];
  undoHistory: UndoHistoryEntry[];
  sessionCommandLogs: SessionCommandLogEntry[];
  createdAlbums: CreatedAlbum[];
}

const DEFAULT_STATE: PersistentAppStateData = {
  onboardingConfig: null,
  pinnedSlots: [],
  folderUsage: [],
  trashEntries: [],
  undoHistory: [],
  sessionCommandLogs: [],
  createdAlbums: [],
};

const APP_STATE_KEY = 'fix_my_gallery_app_state_v1';

export class PersistentAppStateRepository implements AppStateRepository {
  constructor(private readonly store: KeyValueStore) {}

  async saveOnboardingConfig(config: OnboardingConfig): Promise<void> {
    const state = await this.readState();
    state.onboardingConfig = config;
    await this.writeState(state);
  }

  async loadOnboardingConfig(): Promise<OnboardingConfig | null> {
    const state = await this.readState();
    return state.onboardingConfig;
  }

  async savePinnedSlots(slots: PinnedSlot[]): Promise<void> {
    const state = await this.readState();
    state.pinnedSlots = [...slots];
    await this.writeState(state);
  }

  async loadPinnedSlots(): Promise<PinnedSlot[]> {
    const state = await this.readState();
    return [...state.pinnedSlots];
  }

  async saveFolderUsage(usage: FolderUsage[]): Promise<void> {
    const state = await this.readState();
    state.folderUsage = [...usage];
    await this.writeState(state);
  }

  async loadFolderUsage(): Promise<FolderUsage[]> {
    const state = await this.readState();
    return [...state.folderUsage];
  }

  async appendTrashEntries(entries: TrashEntry[]): Promise<void> {
    const state = await this.readState();
    state.trashEntries.push(...entries);
    await this.writeState(state);
  }

  async loadTrashEntries(): Promise<TrashEntry[]> {
    const state = await this.readState();
    return [...state.trashEntries];
  }

  async removeTrashEntries(mediaStoreIds: string[]): Promise<number> {
    const state = await this.readState();
    const before = state.trashEntries.length;
    const removalSet = new Set(mediaStoreIds);
    state.trashEntries = state.trashEntries.filter((entry) => !removalSet.has(entry.mediaStoreId));
    await this.writeState(state);
    return before - state.trashEntries.length;
  }

  async appendUndoHistoryEntry(entry: UndoHistoryEntry): Promise<void> {
    const state = await this.readState();
    state.undoHistory.push(entry);
    await this.writeState(state);
  }

  async loadUndoHistory(): Promise<UndoHistoryEntry[]> {
    const state = await this.readState();
    return [...state.undoHistory];
  }

  async popLastUndoHistoryEntry(): Promise<UndoHistoryEntry | null> {
    const state = await this.readState();
    const entry = state.undoHistory.pop() ?? null;
    await this.writeState(state);
    return entry;
  }

  async appendSessionCommandLog(entry: SessionCommandLogEntry): Promise<void> {
    const state = await this.readState();
    state.sessionCommandLogs.push(entry);
    await this.writeState(state);
  }

  async loadSessionCommandLogs(): Promise<SessionCommandLogEntry[]> {
    const state = await this.readState();
    return [...state.sessionCommandLogs];
  }

  async saveCreatedAlbums(albums: CreatedAlbum[]): Promise<void> {
    const state = await this.readState();
    state.createdAlbums = [...albums];
    await this.writeState(state);
  }

  async loadCreatedAlbums(): Promise<CreatedAlbum[]> {
    const state = await this.readState();
    return [...state.createdAlbums];
  }

  private async readState(): Promise<PersistentAppStateData> {
    const raw = await this.store.get(APP_STATE_KEY);

    if (!raw) {
      return { ...DEFAULT_STATE };
    }

    return {
      ...DEFAULT_STATE,
      ...JSON.parse(raw),
    } as PersistentAppStateData;
  }

  private async writeState(state: PersistentAppStateData): Promise<void> {
    await this.store.set(APP_STATE_KEY, JSON.stringify(state));
  }
}
