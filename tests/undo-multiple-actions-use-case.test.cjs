const test = require('node:test');
const assert = require('node:assert/strict');
const { UndoMultipleActionsUseCase } = require('../dist/domain/use-cases/undo-multiple-actions-use-case');
const { UndoLastActionUseCase } = require('../dist/domain/use-cases/undo-last-action-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('UndoMultipleActionsUseCase undoes multiple actions from stack', async () => {
  const repo = new InMemoryAppStateRepository();
  await repo.appendUndoHistoryEntry({ id: '1', operationType: 'move_back_to_source', mediaStoreIds: ['m1'], createdAt: Date.now() });
  await repo.appendUndoHistoryEntry({ id: '2', operationType: 'move_back_to_source', mediaStoreIds: ['m2'], createdAt: Date.now() });

  const useCase = new UndoMultipleActionsUseCase(new UndoLastActionUseCase(repo));
  const result = await useCase.execute(5);

  assert.equal(result.undoneCount, 2);
});
