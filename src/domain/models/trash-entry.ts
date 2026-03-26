export interface TrashEntry {
  mediaStoreId: string;
  originalFolderBucketId: string;
  deletedAt: number;
  restoreBy?: number;
}
