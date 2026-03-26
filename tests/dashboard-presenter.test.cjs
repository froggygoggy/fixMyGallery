const test = require('node:test');
const assert = require('node:assert/strict');
const { DashboardPresenter } = require('../dist/app/presenters/dashboard-presenter');
const { DashboardController } = require('../dist/app/adapters/dashboard-controller');
const { BootstrapDashboardUseCase } = require('../dist/domain/use-cases/bootstrap-dashboard-use-case');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

const DAY = 24 * 60 * 60 * 1000;

test('DashboardPresenter maps controller output to screen state', async () => {
  const nowMs = Date.UTC(2026, 2, 26, 20, 0, 0);

  const cleanupRepo = new InMemoryCleanupRepository({
    folders: [{ id: 'f1', mediaStoreBucketId: 'cam', name: 'Camera', path: '/camera', selected: true, progressState: 'in_progress' }],
    mediaItems: [{ mediaStoreId: 'm1', uri: 'a', folderBucketId: 'cam', dateTaken: nowMs - 2 * DAY, mimeType: 'image/jpeg', sizeBytes: 1 }],
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

  const presenter = new DashboardPresenter(new DashboardController(new BootstrapDashboardUseCase(cleanupRepo, appRepo)));
  const state = await presenter.load(new Date(nowMs), false);

  assert.equal(state.stats.openNewCount, 1);
  assert.equal(state.notificationBannerVisible, true);
});
