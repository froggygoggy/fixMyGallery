export interface PermissionService {
  ensureMediaReadPermissions(): Promise<boolean>;
  hasMediaReadPermissions(): Promise<boolean>;
}
