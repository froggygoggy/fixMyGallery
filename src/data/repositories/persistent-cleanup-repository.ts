import { Folder } from '../../domain/models/folder';
import { MediaItem } from '../../domain/models/media-item';
import { ReviewState } from '../../domain/models/review-state';
import { MutableCleanupRepository } from '../../domain/repositories/mutable-cleanup-repository';
import { KeyValueStore } from './key-value-store';

interface CleanupStateData {
  folders: Folder[];
  mediaItems: MediaItem[];
  reviewStates: ReviewState[];
}

const CLEANUP_STATE_KEY = 'fix_my_gallery_cleanup_state_v1';

const DEFAULT_STATE: CleanupStateData = {
  folders: [],
  mediaItems: [],
  reviewStates: [],
};

export class PersistentCleanupRepository implements MutableCleanupRepository {
  constructor(private readonly store: KeyValueStore) {}

  async getFolders(): Promise<Folder[]> {
    const state = await this.readState();
    return [...state.folders];
  }

  async getMediaItems(): Promise<MediaItem[]> {
    const state = await this.readState();
    return [...state.mediaItems];
  }

  async getReviewStates(): Promise<ReviewState[]> {
    const state = await this.readState();
    return [...state.reviewStates];
  }

  async saveFolders(folders: Folder[]): Promise<void> {
    const state = await this.readState();
    state.folders = [...folders];
    await this.writeState(state);
  }

  async saveMediaItems(mediaItems: MediaItem[]): Promise<void> {
    const state = await this.readState();
    state.mediaItems = [...mediaItems];
    await this.writeState(state);
  }

  async upsertReviewStates(reviewStates: ReviewState[]): Promise<void> {
    const state = await this.readState();
    const byMediaId = new Map(state.reviewStates.map((item) => [item.mediaStoreId, item]));
    reviewStates.forEach((item) => byMediaId.set(item.mediaStoreId, item));
    state.reviewStates = [...byMediaId.values()];
    await this.writeState(state);
  }

  private async readState(): Promise<CleanupStateData> {
    const raw = await this.store.get(CLEANUP_STATE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATE };
    }

    return {
      ...DEFAULT_STATE,
      ...JSON.parse(raw),
    } as CleanupStateData;
  }

  private async writeState(state: CleanupStateData): Promise<void> {
    await this.store.set(CLEANUP_STATE_KEY, JSON.stringify(state));
  }
}
