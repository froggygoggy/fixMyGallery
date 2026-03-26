import { Folder } from '../models/folder';
import { MediaItem } from '../models/media-item';
import { ReviewState } from '../models/review-state';
import { CleanupRepository } from './cleanup-repository';

export interface MutableCleanupRepository extends CleanupRepository {
  saveFolders(folders: Folder[]): Promise<void>;
  saveMediaItems(mediaItems: MediaItem[]): Promise<void>;
  upsertReviewStates(reviewStates: ReviewState[]): Promise<void>;
}
