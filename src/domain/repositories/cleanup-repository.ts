import { Folder } from '../models/folder';
import { MediaItem } from '../models/media-item';
import { ReviewState } from '../models/review-state';

export interface CleanupRepository {
  getFolders(): Promise<Folder[]>;
  getMediaItems(): Promise<MediaItem[]>;
  getReviewStates(): Promise<ReviewState[]>;
}
