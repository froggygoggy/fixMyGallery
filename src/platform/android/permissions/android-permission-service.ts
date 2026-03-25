import { PermissionService } from '../../../domain/services/permission-service';

/**
 * Platzhalter für die Android-Berechtigungslogik.
 *
 * Für API 33+ sollen READ_MEDIA_IMAGES und READ_MEDIA_VIDEO geprüft werden.
 * Für ältere Android-Versionen READ_EXTERNAL_STORAGE.
 */
export class AndroidPermissionService implements PermissionService {
  async ensureMediaReadPermissions(): Promise<boolean> {
    // TODO: React-Native Permissions API anbinden.
    return false;
  }

  async hasMediaReadPermissions(): Promise<boolean> {
    // TODO: Echte Plattformprüfung implementieren.
    return false;
  }
}
