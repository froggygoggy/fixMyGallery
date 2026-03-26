export interface MediaItem {
  mediaStoreId: string;
  uri: string;
  folderBucketId: string;
  dateTaken: number;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}
