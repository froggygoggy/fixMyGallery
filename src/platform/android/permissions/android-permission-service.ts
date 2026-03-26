import { PermissionService } from '../../../domain/services/permission-service';

export const ANDROID_MEDIA_PERMISSIONS = {
  images: 'android.permission.READ_MEDIA_IMAGES',
  video: 'android.permission.READ_MEDIA_VIDEO',
  externalStorage: 'android.permission.READ_EXTERNAL_STORAGE',
} as const;

export interface AndroidPermissionBridge {
  check(permission: string): Promise<boolean>;
  request(permissions: string[]): Promise<Record<string, boolean>>;
}

export interface AndroidPermissionServiceDeps {
  sdkInt: () => number;
  bridge: AndroidPermissionBridge;
}

function requiredPermissionsForSdk(sdkInt: number): string[] {
  if (sdkInt >= 33) {
    return [ANDROID_MEDIA_PERMISSIONS.images, ANDROID_MEDIA_PERMISSIONS.video];
  }

  return [ANDROID_MEDIA_PERMISSIONS.externalStorage];
}

export class AndroidPermissionService implements PermissionService {
  constructor(private readonly deps: AndroidPermissionServiceDeps) {}

  async ensureMediaReadPermissions(): Promise<boolean> {
    const requiredPermissions = requiredPermissionsForSdk(this.deps.sdkInt());
    const alreadyGranted = await this.areAllGranted(requiredPermissions);

    if (alreadyGranted) {
      return true;
    }

    const requestResult = await this.deps.bridge.request(requiredPermissions);
    return requiredPermissions.every((permission) => requestResult[permission] === true);
  }

  async hasMediaReadPermissions(): Promise<boolean> {
    return this.areAllGranted(requiredPermissionsForSdk(this.deps.sdkInt()));
  }

  private async areAllGranted(permissions: string[]): Promise<boolean> {
    const checks = await Promise.all(permissions.map((permission) => this.deps.bridge.check(permission)));
    return checks.every((granted) => granted === true);
  }
}
