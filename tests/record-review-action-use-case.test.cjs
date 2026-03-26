const test = require('node:test');
const assert = require('node:assert/strict');
const { InMemoryCleanupRepository } = require('../dist/data/repositories/in-memory-cleanup-repository');
const { RecordReviewActionUseCase } = require('../dist/domain/use-cases/record-review-action-use-case');

test('RecordReviewActionUseCase writes moved review states for multiple media ids', async () => {
  const repo = new InMemoryCleanupRepository();
  const useCase = new RecordReviewActionUseCase(repo);

  const reviewStates = await useCase.execute({
    mediaStoreIds: ['m1', 'm2'],
    action: 'moved',
    sourceFolderId: 'camera',
    targetFolderId: 'family',
    timestampMs: 123,
  });

  assert.equal(reviewStates.length, 2);
  assert.equal(reviewStates[0].status, 'moved');

  const stored = await repo.getReviewStates();
  assert.equal(stored.length, 2);
  assert.equal(stored[1].targetFolderId, 'family');
});
