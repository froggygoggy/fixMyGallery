const test = require('node:test');
const assert = require('node:assert/strict');
const { UndoLastActionUseCase } = require('../dist/domain/use-cases/undo-last-action-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('UndoLastActionUseCase restores from trash based on undo history', async () => {
  const repo = new InMemoryAppStateRepository();
  await repo.appendTrashEntries([{ mediaStoreId: 'm1', originalFolderBucketId: 'cam', deletedAt: Date.now() }]);
  await repo.appendUndoHistoryEntry({
    id: '1',
    operationType: 'restore_from_trash',
    mediaStoreIds: ['m1'],
    createdAt: Date.now(),
  });

  const useCase = new UndoLastActionUseCase(repo);
  const result = await useCase.execute();

  assert.equal(result.undone, true);
  assert.equal(result.restoredFromTrashCount, 1);
});
