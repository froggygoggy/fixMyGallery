const test = require('node:test');
const assert = require('node:assert/strict');
const {
  AndroidPermissionService,
  ANDROID_MEDIA_PERMISSIONS,
} = require('../dist/platform/android/permissions/android-permission-service');

test('AndroidPermissionService checks API 33+ media permissions', async () => {
  const grantedPermissions = new Set([
    ANDROID_MEDIA_PERMISSIONS.images,
    ANDROID_MEDIA_PERMISSIONS.video,
  ]);

  const service = new AndroidPermissionService({
    sdkInt: () => 34,
    bridge: {
      check: async (permission) => grantedPermissions.has(permission),
      request: async () => ({}),
    },
  });

  assert.equal(await service.hasMediaReadPermissions(), true);
});

test('AndroidPermissionService requests missing permissions and returns final result', async () => {
  const grantedPermissions = new Set();

  const service = new AndroidPermissionService({
    sdkInt: () => 33,
    bridge: {
      check: async (permission) => grantedPermissions.has(permission),
      request: async (permissions) => {
        permissions.forEach((permission) => grantedPermissions.add(permission));
        return Object.fromEntries(permissions.map((permission) => [permission, true]));
      },
    },
  });

  assert.equal(await service.ensureMediaReadPermissions(), true);
  assert.equal(grantedPermissions.has(ANDROID_MEDIA_PERMISSIONS.images), true);
  assert.equal(grantedPermissions.has(ANDROID_MEDIA_PERMISSIONS.video), true);
});

test('AndroidPermissionService uses legacy external storage permission on old Android', async () => {
  const service = new AndroidPermissionService({
    sdkInt: () => 30,
    bridge: {
      check: async (permission) => permission === ANDROID_MEDIA_PERMISSIONS.externalStorage,
      request: async () => ({}),
    },
  });

  assert.equal(await service.hasMediaReadPermissions(), true);
});
