const test = require('node:test');
const assert = require('node:assert/strict');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { DefaultProgressService } = require('../dist/domain/services/default-progress-service');

const DAY = 24 * 60 * 60 * 1000;

test('DefaultProgressService computes open counts and folder progress', async () => {
  const now = Date.UTC(2026, 2, 25);
  const repo = new InMemoryCleanupRepository({
    folders: [{ id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' }],
    mediaItems: [
      { mediaStoreId: 'm1', uri: 'a', folderBucketId: 'cam', dateTaken: now - 2 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'm2', uri: 'b', folderBucketId: 'cam', dateTaken: now - 60 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    ],
    reviewStates: [{ mediaStoreId: 'm2', status: 'processed' }],
  });

  const service = new DefaultProgressService(repo, 30, () => now);

  const newOpen = await service.getOpenItemCount('new');
  const oldOpen = await service.getOpenItemCount('old');
  const progress = await service.getFolderProgress();

  assert.equal(newOpen, 1);
  assert.equal(oldOpen, 0);
  assert.deepEqual(progress, [{ folderId: 'f1', done: 1, total: 2 }]);
});
