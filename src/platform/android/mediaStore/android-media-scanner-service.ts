import { Folder } from '../../../domain/models/folder';
import { MediaItem } from '../../../domain/models/media-item';
import { MediaScannerService } from '../../../domain/services/media-scanner-service';

/**
 * Platzhalter für die Android-MediaStore-Integration.
 */
export class AndroidMediaScannerService implements MediaScannerService {
  async scanFolders(): Promise<Folder[]> {
    // TODO: MediaStore Buckets lesen.
    return [];
  }

  async scanMediaForSelectedFolders(_bucketIds: string[]): Promise<MediaItem[]> {
    // TODO: Media aus ausgewählten Buckets lesen.
    return [];
  }
}
