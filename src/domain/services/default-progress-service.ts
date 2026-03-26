import { CleanupRepository } from '../repositories/cleanup-repository';
import { FolderProgress, ProgressService } from './progress-service';
import { CleanupMode } from '../types/cleanup';

export class DefaultProgressService implements ProgressService {
  constructor(
    private readonly repository: CleanupRepository,
    private readonly newWindowDays: number = 30,
    private readonly nowMsProvider: () => number = () => Date.now(),
  ) {}

  async getOpenItemCount(mode: CleanupMode): Promise<number> {
    const mediaItems = await this.repository.getMediaItems();
    const reviewStates = await this.repository.getReviewStates();
    const reviewStateMap = new Map(reviewStates.map((state) => [state.mediaStoreId, state.status]));

    const cutoff = this.nowMsProvider() - this.newWindowDays * 24 * 60 * 60 * 1000;

    return mediaItems
      .filter((item) => (reviewStateMap.get(item.mediaStoreId) ?? 'pending') === 'pending')
      .filter((item) => (mode === 'new' ? item.dateTaken >= cutoff : item.dateTaken < cutoff)).length;
  }

  async getFolderProgress(): Promise<FolderProgress[]> {
    const folders = await this.repository.getFolders();
    const mediaItems = await this.repository.getMediaItems();
    const reviewStates = await this.repository.getReviewStates();
    const reviewStateMap = new Map(reviewStates.map((state) => [state.mediaStoreId, state.status]));

    return folders.map((folder) => {
      const folderMedia = mediaItems.filter((item) => item.folderBucketId === folder.mediaStoreBucketId);
      const done = folderMedia.filter((item) => (reviewStateMap.get(item.mediaStoreId) ?? 'pending') !== 'pending').length;

      return {
        folderId: folder.id,
        done,
        total: folderMedia.length,
      };
    });
  }
}
