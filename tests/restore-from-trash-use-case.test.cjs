const test = require('node:test');
const assert = require('node:assert/strict');
const { RestoreFromTrashUseCase } = require('../dist/domain/use-cases/restore-from-trash-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('RestoreFromTrashUseCase restores entries and writes undo history', async () => {
  const repo = new InMemoryAppStateRepository();
  const now = new Date(Date.UTC(2026, 2, 26));

  await repo.appendTrashEntries([
    { mediaStoreId: 'm1', originalFolderBucketId: 'cam', deletedAt: now.getTime() },
    { mediaStoreId: 'm2', originalFolderBucketId: 'cam', deletedAt: now.getTime() },
  ]);

  const useCase = new RestoreFromTrashUseCase(repo);
  const result = await useCase.execute({ mediaStoreIds: ['m1'], now });

  assert.equal(result.restoredCount, 1);
  assert.equal(result.remainingTrashCount, 1);

  const undo = await repo.loadUndoHistory();
  assert.equal(undo.length, 1);
  assert.equal(undo[0].operationType, 'restore_from_trash');
});
