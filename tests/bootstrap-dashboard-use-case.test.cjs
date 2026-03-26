const test = require('node:test');
const assert = require('node:assert/strict');
const { BootstrapDashboardUseCase } = require('../dist/domain/use-cases/bootstrap-dashboard-use-case');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

const DAY = 24 * 60 * 60 * 1000;

test('BootstrapDashboardUseCase computes counts and reminder decision', async () => {
  const nowMs = Date.UTC(2026, 2, 26, 20, 0, 0);

  const cleanupRepo = new InMemoryCleanupRepository({
    folders: [
      { id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' },
    ],
    mediaItems: [
      { mediaStoreId: 'new1', uri: 'n1', folderBucketId: 'cam', dateTaken: nowMs - 3 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'old1', uri: 'o1', folderBucketId: 'cam', dateTaken: nowMs - 60 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    ],
    reviewStates: [],
  });

  const appStateRepo = new InMemoryAppStateRepository();
  await appStateRepo.saveOnboardingConfig({
    onboardingState: { completed: true, selectedFolderBucketIds: ['cam'] },
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '19:00' },
    newPhotosSettings: { windowDays: 30 },
  });

  const useCase = new BootstrapDashboardUseCase(cleanupRepo, appStateRepo);
  const summary = await useCase.execute({ now: new Date(nowMs), alreadyNotifiedToday: false });

  assert.equal(summary.openNewCount, 1);
  assert.equal(summary.openOldCount, 1);
  assert.equal(summary.shouldNotifyNow, true);
  assert.deepEqual(summary.folderProgress, [{ folderId: 'f1', done: 0, total: 2 }]);
});
