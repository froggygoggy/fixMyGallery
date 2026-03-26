import { Folder } from '../../../domain/models/folder';
import { MediaItem } from '../../../domain/models/media-item';
import { MediaScannerService } from '../../../domain/services/media-scanner-service';

export interface AndroidMediaStoreFolderRecord {
  bucketId: string;
  name: string;
  path: string;
}

export interface AndroidMediaStoreMediaRecord {
  mediaStoreId: string;
  uri: string;
  bucketId: string;
  dateTaken: number;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export interface AndroidMediaStoreBridge {
  listFolders(): Promise<AndroidMediaStoreFolderRecord[]>;
  listMediaByBucketIds(bucketIds: string[]): Promise<AndroidMediaStoreMediaRecord[]>;
}

export class AndroidMediaScannerService implements MediaScannerService {
  constructor(private readonly bridge: AndroidMediaStoreBridge) {}

  async scanFolders(): Promise<Folder[]> {
    const folders = await this.bridge.listFolders();

    return folders
      .filter((folder) => folder.bucketId.length > 0 && folder.path.length > 0)
      .map((folder) => ({
        id: folder.bucketId,
        mediaStoreBucketId: folder.bucketId,
        name: folder.name,
        path: folder.path,
        selected: false,
        progressState: 'not_started' as const,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async scanMediaForSelectedFolders(bucketIds: string[]): Promise<MediaItem[]> {
    if (bucketIds.length === 0) {
      return [];
    }

    const allowedBucketIds = new Set(bucketIds);
    const records = await this.bridge.listMediaByBucketIds(bucketIds);

    return records
      .filter((item) => allowedBucketIds.has(item.bucketId))
      .map((item) => ({
        mediaStoreId: item.mediaStoreId,
        uri: item.uri,
        folderBucketId: item.bucketId,
        dateTaken: item.dateTaken,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
        width: item.width,
        height: item.height,
      }))
      .sort((a, b) => b.dateTaken - a.dateTaken);
  }
}
