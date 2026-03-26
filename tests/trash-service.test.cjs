const test = require('node:test');
const assert = require('node:assert/strict');
const { TrashService } = require('../dist/domain/services/trash-service');

test('TrashService creates entries with restore window and validates restore', () => {
  const service = new TrashService({ restoreWindowDays: 2 });
  const now = Date.UTC(2026, 2, 26);

  const [entry] = service.createEntriesForDelete({
    mediaStoreIds: ['m1'],
    sourceFolderBucketId: 'cam',
    deletedAtMs: now,
  });

  assert.equal(entry.mediaStoreId, 'm1');
  assert.equal(entry.originalFolderBucketId, 'cam');
  assert.equal(service.canRestore(entry, now + 1), true);
  assert.equal(service.canRestore(entry, now + 3 * 24 * 60 * 60 * 1000), false);
});
