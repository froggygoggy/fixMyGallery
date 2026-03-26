const test = require('node:test');
const assert = require('node:assert/strict');
const { PersistentCleanupRepository } = require('../dist/data/repositories/persistent-cleanup-repository');

class InMemoryKeyValueStore {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key) ?? null;
  }

  async set(key, value) {
    this.data.set(key, value);
  }
}

test('PersistentCleanupRepository stores folders/media/review state', async () => {
  const repo = new PersistentCleanupRepository(new InMemoryKeyValueStore());

  await repo.saveFolders([{ id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' }]);
  await repo.saveMediaItems([{ mediaStoreId: 'm1', uri: 'content://m1', folderBucketId: 'cam', dateTaken: 1, mimeType: 'image/jpeg', sizeBytes: 100 }]);
  await repo.upsertReviewStates([{ mediaStoreId: 'm1', status: 'processed', processedAt: 2 }]);

  const folders = await repo.getFolders();
  const media = await repo.getMediaItems();
  const reviews = await repo.getReviewStates();

  assert.equal(folders.length, 1);
  assert.equal(media.length, 1);
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].status, 'processed');
});

test('PersistentCleanupRepository upsertReviewStates overwrites by media id', async () => {
  const repo = new PersistentCleanupRepository(new InMemoryKeyValueStore());
  await repo.upsertReviewStates([{ mediaStoreId: 'm1', status: 'processed', processedAt: 2 }]);
  await repo.upsertReviewStates([{ mediaStoreId: 'm1', status: 'deleted', processedAt: 3 }]);

  const reviews = await repo.getReviewStates();
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].status, 'deleted');
});
