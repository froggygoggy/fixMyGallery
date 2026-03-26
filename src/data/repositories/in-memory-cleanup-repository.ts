import { Folder } from '../../domain/models/folder';
import { MediaItem } from '../../domain/models/media-item';
import { ReviewState } from '../../domain/models/review-state';
import { MutableCleanupRepository } from '../../domain/repositories/mutable-cleanup-repository';

export interface InMemoryCleanupRepositorySeed {
  folders?: Folder[];
  mediaItems?: MediaItem[];
  reviewStates?: ReviewState[];
}

export class InMemoryCleanupRepository implements MutableCleanupRepository {
  private folders: Folder[];
  private mediaItems: MediaItem[];
  private reviewStates: ReviewState[];

  constructor(seed: InMemoryCleanupRepositorySeed = {}) {
    this.folders = seed.folders ?? [];
    this.mediaItems = seed.mediaItems ?? [];
    this.reviewStates = seed.reviewStates ?? [];
  }

  async getFolders(): Promise<Folder[]> {
    return [...this.folders];
  }

  async getMediaItems(): Promise<MediaItem[]> {
    return [...this.mediaItems];
  }

  async getReviewStates(): Promise<ReviewState[]> {
    return [...this.reviewStates];
  }

  async saveFolders(folders: Folder[]): Promise<void> {
    this.folders = [...folders];
  }

  async saveMediaItems(mediaItems: MediaItem[]): Promise<void> {
    this.mediaItems = [...mediaItems];
  }

  async upsertReviewStates(reviewStates: ReviewState[]): Promise<void> {
    const byMediaId = new Map(this.reviewStates.map((item) => [item.mediaStoreId, item]));
    reviewStates.forEach((item) => byMediaId.set(item.mediaStoreId, item));
    this.reviewStates = [...byMediaId.values()];
  }
}
