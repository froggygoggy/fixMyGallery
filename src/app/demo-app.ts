import { InMemoryAppStateRepository } from '../data/repositories/in-memory-app-state-repository';
import { InMemoryCleanupRepository } from '../data/repositories/in-memory-cleanup-repository';
import { CompleteSprint2FlowUseCase } from '../domain/use-cases/complete-sprint2-flow-use-case';

const DAY_MS = 24 * 60 * 60 * 1000;

async function runDemoApp(): Promise<void> {
  const now = new Date(Date.UTC(2026, 2, 26, 20, 0, 0));
  const nowMs = now.getTime();

  const cleanupRepo = new InMemoryCleanupRepository({
    folders: [
      {
        id: 'f_camera',
        mediaStoreBucketId: 'camera',
        name: 'Camera',
        path: '/storage/emulated/0/DCIM/Camera',
        selected: true,
        progressState: 'in_progress',
      },
      {
        id: 'f_screenshots',
        mediaStoreBucketId: 'screenshots',
        name: 'Screenshots',
        path: '/storage/emulated/0/Pictures/Screenshots',
        selected: true,
        progressState: 'in_progress',
      },
    ],
    mediaItems: [
      {
        mediaStoreId: 'm_new_1',
        uri: 'content://media/external/images/media/m_new_1',
        folderBucketId: 'camera',
        dateTaken: nowMs - 2 * DAY_MS,
        mimeType: 'image/jpeg',
        sizeBytes: 1024,
      },
      {
        mediaStoreId: 'm_old_1',
        uri: 'content://media/external/images/media/m_old_1',
        folderBucketId: 'camera',
        dateTaken: nowMs - 120 * DAY_MS,
        mimeType: 'image/jpeg',
        sizeBytes: 4096,
      },
      {
        mediaStoreId: 'm_old_2',
        uri: 'content://media/external/images/media/m_old_2',
        folderBucketId: 'screenshots',
        dateTaken: nowMs - 90 * DAY_MS,
        mimeType: 'image/png',
        sizeBytes: 2048,
      },
    ],
    reviewStates: [],
  });

  const appStateRepo = new InMemoryAppStateRepository();

  await appStateRepo.saveFolderUsage([
    { folderBucketId: 'camera', lastUsedAt: nowMs - 3 * DAY_MS, useCount: 7 },
    { folderBucketId: 'screenshots', lastUsedAt: nowMs - 1 * DAY_MS, useCount: 5 },
  ]);

  const flowUseCase = new CompleteSprint2FlowUseCase(cleanupRepo, appStateRepo);

  const report = await flowUseCase.execute({
    onboarding: {
      selectedFolderBucketIds: ['camera', 'screenshots'],
      oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
      newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
      reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '19:00' },
      newPhotosSettings: { windowDays: 30 },
      completedAtMs: nowMs,
    },
    mode: 'old',
    now,
    pinnedSlots: [{ position: 'left_center', actionType: 'delete', enabled: true }],
    deleteFallbackDirection: 'left',
    alreadyNotifiedToday: false,
  });

  console.log('✅ Fix my Gallery Demo gestartet');
  console.log(JSON.stringify(report, null, 2));
}

runDemoApp().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('❌ Demo fehlgeschlagen:', message);
});
