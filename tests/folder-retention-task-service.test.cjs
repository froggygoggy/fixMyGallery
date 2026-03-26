const test = require('node:test');
const assert = require('node:assert/strict');
const { FolderRetentionTaskService } = require('../dist/domain/services/folder-retention-task-service');

const DAY = 24 * 60 * 60 * 1000;

test('FolderRetentionTaskService creates deletion tasks per configured folder age', () => {
  const nowMs = Date.UTC(2026, 2, 26, 12, 0, 0);
  const service = new FolderRetentionTaskService();

  const tasks = service.buildTasks({
    nowMs,
    rules: [
      { folderBucketId: 'whatsapp', minAgeDays: 365, enabled: true },
      { folderBucketId: 'camera', minAgeDays: 30, enabled: false },
    ],
    mediaItems: [
      { mediaStoreId: 'wa-old', uri: 'a', folderBucketId: 'whatsapp', dateTaken: nowMs - 500 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'wa-new', uri: 'b', folderBucketId: 'whatsapp', dateTaken: nowMs - 10 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'cam-old', uri: 'c', folderBucketId: 'camera', dateTaken: nowMs - 40 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    ],
    reviewStates: [{ mediaStoreId: 'wa-new', status: 'processed', processedAt: nowMs }],
  });

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].folderBucketId, 'whatsapp');
  assert.deepEqual(tasks[0].candidateMediaStoreIds, ['wa-old']);
});
