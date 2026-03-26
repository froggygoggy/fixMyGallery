const test = require('node:test');
const assert = require('node:assert/strict');
const { PlanActionOutcomeUseCase } = require('../dist/domain/use-cases/plan-action-outcome-use-case');

test('PlanActionOutcomeUseCase generates trash + undo for delete', () => {
  const useCase = new PlanActionOutcomeUseCase();

  const result = useCase.execute({
    action: { type: 'delete', mediaStoreIds: ['m1', 'm2'] },
    sourceFolderBucketId: 'wa',
    actionTimestampMs: Date.UTC(2026, 2, 26),
  });

  assert.equal(result.undo.type, 'restore_from_trash');
  assert.equal(result.trashEntries.length, 2);
  assert.equal(result.trashEntries[0].originalFolderBucketId, 'wa');
});

test('PlanActionOutcomeUseCase leaves trash empty for non-delete action', () => {
  const useCase = new PlanActionOutcomeUseCase();

  const result = useCase.execute({
    action: { type: 'move_to_folder', mediaStoreIds: ['m1'], folderBucketId: 'family' },
    sourceFolderBucketId: 'cam',
  });

  assert.equal(result.undo.type, 'move_back_to_source');
  assert.equal(result.trashEntries.length, 0);
});
