const test = require('node:test');
const assert = require('node:assert/strict');
const { CompleteSprint2FlowUseCase } = require('../dist/domain/use-cases/complete-sprint2-flow-use-case');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

const DAY = 24 * 60 * 60 * 1000;

test('CompleteSprint2FlowUseCase executes onboarding -> dashboard -> session step', async () => {
  const nowMs = Date.UTC(2026, 2, 26, 20, 0, 0);

  const cleanupRepo = new InMemoryCleanupRepository({
    folders: [
      { id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' },
    ],
    mediaItems: [
      { mediaStoreId: 'm1', uri: 'a', folderBucketId: 'cam', dateTaken: nowMs - 2 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'm2', uri: 'b', folderBucketId: 'cam', dateTaken: nowMs - 60 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    ],
    reviewStates: [],
  });

  const appStateRepo = new InMemoryAppStateRepository();
  const useCase = new CompleteSprint2FlowUseCase(cleanupRepo, appStateRepo);

  const report = await useCase.execute({
    onboarding: {
      selectedFolderBucketIds: ['cam'],
      oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
      newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
      reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '19:00' },
      newPhotosSettings: { windowDays: 30 },
      completedAtMs: nowMs,
    },
    mode: 'new',
    now: new Date(nowMs),
    pinnedSlots: [{ position: 'left_center', actionType: 'delete', enabled: true }],
    deleteFallbackDirection: 'left',
    alreadyNotifiedToday: false,
  });

  assert.equal(report.onboardingCompleted, true);
  assert.equal(report.queueSize, 1);
  assert.equal(report.firstQueueItems.length, 1);
  assert.equal(report.sessionStateAfterFirstAction.status, 'goal_reached');
  assert.equal(report.trashCount, 1);
  assert.equal(report.undoHistoryCount, 1);
});
