const test = require('node:test');
const assert = require('node:assert/strict');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { StartSessionUseCase } = require('../dist/domain/use-cases/start-session-use-case');

const DAY = 24 * 60 * 60 * 1000;

test('StartSessionUseCase returns queue and recommendations', async () => {
  const now = Date.UTC(2026, 2, 25);

  const repo = new InMemoryCleanupRepository({
    mediaItems: [
      { mediaStoreId: 'n1', uri: 'x', folderBucketId: 'cam', dateTaken: now - 5 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'o1', uri: 'y', folderBucketId: 'wa', dateTaken: now - 90 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    ],
    reviewStates: [],
  });

  const useCase = new StartSessionUseCase(repo);
  const result = await useCase.execute({
    mode: 'new',
    selectedFolderBucketIds: ['cam', 'wa'],
    folderUsage: [
      { folderBucketId: 'wa', useCount: 10, lastUsedAt: 200 },
      { folderBucketId: 'cam', useCount: 50, lastUsedAt: 100 },
    ],
    nowMs: now,
    newWindowDays: 30,
  });

  assert.equal(result.totalPendingCount, 1);
  assert.deepEqual(result.queue.map((item) => item.mediaStoreId), ['n1']);
  assert.deepEqual(result.recommendedFolderBucketIds, ['wa', 'cam']);
});
