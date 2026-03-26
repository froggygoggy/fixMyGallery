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


test('CleanupQueueEngine supports day-month grouping independent from year', () => {
  const engine = new CleanupQueueEngine();
  const now = Date.UTC(2026, 2, 25);

  const mediaItems = [
    { mediaStoreId: 'a', uri: 'a', folderBucketId: 'cam', dateTaken: Date.UTC(2024, 0, 2), mimeType: 'image/jpeg', sizeBytes: 1 },
    { mediaStoreId: 'b', uri: 'b', folderBucketId: 'cam', dateTaken: Date.UTC(2025, 0, 1), mimeType: 'image/jpeg', sizeBytes: 1 },
    { mediaStoreId: 'c', uri: 'c', folderBucketId: 'cam', dateTaken: Date.UTC(2021, 11, 31), mimeType: 'image/jpeg', sizeBytes: 1 },
  ];

  const queue = engine.getQueue('old', {
    mediaItems,
    selectedFolderBucketIds: ['cam'],
    reviewStatusByMediaId: {},
    nowMs: now,
    newWindowDays: 30,
    ordering: 'day_month',
  });

  assert.deepEqual(queue.map((item) => item.mediaStoreId), ['b', 'a', 'c']);
});
