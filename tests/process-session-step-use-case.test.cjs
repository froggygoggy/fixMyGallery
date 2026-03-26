const test = require('node:test');
const assert = require('node:assert/strict');
const { ProcessSessionStepUseCase } = require('../dist/domain/use-cases/process-session-step-use-case');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');
const { SessionStateMachineService } = require('../dist/domain/services/session-state-machine-service');

const DAY = 24 * 60 * 60 * 1000;

function slotPositions() {
  return {
    left_center: { x: 0, y: 100 },
    right_center: { x: 300, y: 100 },
    top_left: { x: 0, y: 0 },
    top_center: { x: 150, y: 0 },
    bottom_left: { x: 0, y: 200 },
    bottom_center: { x: 150, y: 200 },
  };
}

test('ProcessSessionStepUseCase persists undo/trash and returns refreshed dashboard', async () => {
  const nowMs = Date.UTC(2026, 2, 26, 20, 0, 0);

  const cleanupRepo = new InMemoryCleanupRepository({
    folders: [{ id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' }],
    mediaItems: [
      { mediaStoreId: 'm1', uri: 'a', folderBucketId: 'cam', dateTaken: nowMs - 2 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
      { mediaStoreId: 'm2', uri: 'b', folderBucketId: 'cam', dateTaken: nowMs - 45 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 },
    ],
    reviewStates: [],
  });

  const appRepo = new InMemoryAppStateRepository();
  await appRepo.saveOnboardingConfig({
    onboardingState: { completed: true, selectedFolderBucketIds: ['cam'] },
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '19:00' },
    newPhotosSettings: { windowDays: 30 },
  });

  const sm = new SessionStateMachineService();
  const state = sm.transition(sm.getInitialState(), {
    type: 'start',
    queueMediaIds: ['m1', 'm2'],
    targetType: 'count',
    targetValue: 5,
  });

  const useCase = new ProcessSessionStepUseCase(cleanupRepo, appRepo);
  const result = await useCase.execute({
    sessionState: state,
    selectedMediaIds: ['m1'],
    swipeEndPoint: { x: 1, y: 100 },
    swipeDirection: 'right',
    deleteFallbackDirection: 'left',
    pinnedSlots: [{ position: 'left_center', actionType: 'delete', enabled: true }],
    slotPositions: slotPositions(),
    sourceFolderBucketId: 'cam',
    hitRadius: 20,
    now: new Date(nowMs),
    alreadyNotifiedToday: false,
  });

  assert.equal(result.nextState.progress.processedCount, 1);
  assert.equal(result.trashCount, 1);
  assert.equal(result.undoHistoryCount, 1);
  assert.equal(result.dashboard.openNewCount, 1);
  assert.equal(result.dashboard.openOldCount, 1);

  const commandLogs = await appRepo.loadSessionCommandLogs();
  assert.equal(commandLogs.length, 1);
  assert.equal(commandLogs[0].actionType, 'delete');
});
