import { InMemoryAppStateRepository } from '../../../src/data/repositories/in-memory-app-state-repository';
import { InMemoryCleanupRepository } from '../../../src/data/repositories/in-memory-cleanup-repository';
import { SessionState } from '../../../src/domain/models/session-state';
import { SessionStateMachineService } from '../../../src/domain/services/session-state-machine-service';
import { BootstrapUiSessionUseCase } from '../../../src/domain/use-cases/bootstrap-ui-session-use-case';
import { AndroidMediaScannerService } from '../../../src/platform/android/mediaStore/android-media-scanner-service';

const DAY_MS = 24 * 60 * 60 * 1000;

class DemoMediaStoreBridge {
  async listFolders() {
    return [
      { bucketId: 'camera', name: 'Camera', path: '/storage/emulated/0/DCIM/Camera' },
      { bucketId: 'screenshots', name: 'Screenshots', path: '/storage/emulated/0/Pictures/Screenshots' },
    ];
  }

  async listMediaByBucketIds(bucketIds: string[]) {
    const nowMs = Date.now();
    const all = [
      { mediaStoreId: 'm-1', uri: 'content://media/m-1', bucketId: 'camera', dateTaken: nowMs - 2 * DAY_MS, mimeType: 'image/jpeg', sizeBytes: 2000 },
      { mediaStoreId: 'm-2', uri: 'content://media/m-2', bucketId: 'camera', dateTaken: nowMs - 65 * DAY_MS, mimeType: 'image/jpeg', sizeBytes: 3000 },
      { mediaStoreId: 'm-3', uri: 'content://media/m-3', bucketId: 'screenshots', dateTaken: nowMs - 88 * DAY_MS, mimeType: 'image/png', sizeBytes: 1500 },
    ];

    const allow = new Set(bucketIds);
    return all.filter((item) => allow.has(item.bucketId));
  }
}

export async function bootstrapOnboardingAndSession(selectedFolderBucketIds: string[]): Promise<{
  queueMediaIds: string[];
  initialState: SessionState;
}> {
  const cleanupRepo = new InMemoryCleanupRepository({ folders: [], mediaItems: [], reviewStates: [] });
  const appStateRepo = new InMemoryAppStateRepository();

  await appStateRepo.saveFolderUsage(selectedFolderBucketIds.map((folderBucketId, index) => ({
    folderBucketId,
    useCount: 5 - index,
    lastUsedAt: Date.now() - index * DAY_MS,
  })));

  const scanner = new AndroidMediaScannerService(new DemoMediaStoreBridge());
  const scannedFolders = await scanner.scanFolders();
  await cleanupRepo.saveFolders(scannedFolders.map((folder) => ({
    ...folder,
    selected: selectedFolderBucketIds.includes(folder.mediaStoreBucketId),
  })));

  const sessionBootstrap = new BootstrapUiSessionUseCase(cleanupRepo, appStateRepo, scanner);
  const bootstrapResult = await sessionBootstrap.execute({
    selectedFolderBucketIds,
    mode: 'old',
    nowMs: Date.now(),
    newWindowDays: 30,
  });

  const stateMachine = new SessionStateMachineService();
  const initialState = stateMachine.transition(stateMachine.getInitialState(), {
    type: 'start',
    queueMediaIds: bootstrapResult.queue.map((item) => item.mediaStoreId),
    targetType: 'count',
    targetValue: 20,
  });

  return {
    queueMediaIds: bootstrapResult.queue.map((item) => item.mediaStoreId),
    initialState,
  };
}
