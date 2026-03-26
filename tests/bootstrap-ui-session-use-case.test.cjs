const test = require('node:test');
const assert = require('node:assert/strict');
const { BootstrapUiSessionUseCase } = require('../dist/domain/use-cases/bootstrap-ui-session-use-case');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

const DAY = 24 * 60 * 60 * 1000;

class FakeMediaScannerService {
  constructor(items) {
    this.items = items;
  }

  async scanFolders() {
    return [];
  }

  async scanMediaForSelectedFolders(bucketIds) {
    const allowed = new Set(bucketIds);
    return this.items.filter((item) => allowed.has(item.folderBucketId));
  }
}

test('BootstrapUiSessionUseCase scans media, persists and creates queue', async () => {
  const nowMs = Date.UTC(2026, 2, 26, 20, 0, 0);

  const cleanupRepo = new InMemoryCleanupRepository({
    folders: [
      { id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' },
    ],
    mediaItems: [],
    reviewStates: [],
  });

  const appStateRepo = new InMemoryAppStateRepository();
  await appStateRepo.saveFolderUsage([{ folderBucketId: 'cam', useCount: 4, lastUsedAt: nowMs - DAY }]);

  const scanner = new FakeMediaScannerService([
    { mediaStoreId: 'm-new', uri: 'x', folderBucketId: 'cam', dateTaken: nowMs - 2 * DAY, mimeType: 'image/jpeg', sizeBytes: 10 },
    { mediaStoreId: 'm-old', uri: 'y', folderBucketId: 'cam', dateTaken: nowMs - 70 * DAY, mimeType: 'image/jpeg', sizeBytes: 10 },
  ]);

  const useCase = new BootstrapUiSessionUseCase(cleanupRepo, appStateRepo, scanner);
  const result = await useCase.execute({
    selectedFolderBucketIds: ['cam'],
    mode: 'old',
    nowMs,
    newWindowDays: 30,
  });

  assert.equal(result.scannedMediaCount, 2);
  assert.equal(result.queue.length, 1);
  assert.equal(result.queue[0].mediaStoreId, 'm-old');
  assert.deepEqual(result.recommendedFolderBucketIds, ['cam']);

  const storedMedia = await cleanupRepo.getMediaItems();
  assert.equal(storedMedia.length, 2);
});
