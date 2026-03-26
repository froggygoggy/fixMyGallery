const test = require('node:test');
const assert = require('node:assert/strict');
const { CleanupQueueEngine } = require('../dist/domain/services/cleanup-queue-engine');

const DAY = 24 * 60 * 60 * 1000;

test('CleanupQueueEngine filters pending and sorts old/new correctly', () => {
  const engine = new CleanupQueueEngine();
  const now = Date.UTC(2026, 2, 25);

  const mediaItems = [
    { mediaStoreId: '1', uri: 'a', folderBucketId: 'cam', dateTaken: now - 5 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    { mediaStoreId: '2', uri: 'b', folderBucketId: 'cam', dateTaken: now - 60 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    { mediaStoreId: '3', uri: 'c', folderBucketId: 'wa', dateTaken: now - 90 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
  ];

  const reviewStatusByMediaId = { '3': 'processed' };

  const newQueue = engine.getQueue('new', {
    mediaItems,
    selectedFolderBucketIds: ['cam', 'wa'],
    reviewStatusByMediaId,
    nowMs: now,
    newWindowDays: 30,
  });

  assert.deepEqual(newQueue.map((item) => item.mediaStoreId), ['1']);

  const oldQueue = engine.getQueue('old', {
    mediaItems,
    selectedFolderBucketIds: ['cam', 'wa'],
    reviewStatusByMediaId,
    nowMs: now,
    newWindowDays: 30,
  });

  assert.deepEqual(oldQueue.map((item) => item.mediaStoreId), ['2']);
});
