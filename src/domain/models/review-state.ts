import { ReviewStatus } from '../types/cleanup';

export interface ReviewState {
  mediaStoreId: string;
  status: ReviewStatus;
  processedAt?: number;
  sourceFolderId?: string;
  targetFolderId?: string;
  reviewTag?: string;
}
