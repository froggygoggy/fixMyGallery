import { Folder } from '../../domain/models/folder';
import { MediaItem } from '../../domain/models/media-item';
import { ReviewState } from '../../domain/models/review-state';
import { CleanupRepository } from '../../domain/repositories/cleanup-repository';

export interface InMemoryCleanupRepositorySeed {
  folders?: Folder[];
  mediaItems?: MediaItem[];
  reviewStates?: ReviewState[];
}

export class InMemoryCleanupRepository implements CleanupRepository {
  constructor(private readonly seed: InMemoryCleanupRepositorySeed = {}) {}

  async getFolders(): Promise<Folder[]> {
    return this.seed.folders ?? [];
  }

  async getMediaItems(): Promise<MediaItem[]> {
    return this.seed.mediaItems ?? [];
  }

  async getReviewStates(): Promise<ReviewState[]> {
    return this.seed.reviewStates ?? [];
  }
}
