import { Folder } from '../models/folder';
import { MediaItem } from '../models/media-item';

export interface MediaScannerService {
  scanFolders(): Promise<Folder[]>;
  scanMediaForSelectedFolders(bucketIds: string[]): Promise<MediaItem[]>;
}
