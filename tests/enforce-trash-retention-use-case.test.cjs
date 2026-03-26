const test = require('node:test');
const assert = require('node:assert/strict');
const { EnforceTrashRetentionUseCase } = require('../dist/domain/use-cases/enforce-trash-retention-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

const DAY = 24 * 60 * 60 * 1000;

test('EnforceTrashRetentionUseCase purges old trash entries', async () => {
  const repo = new InMemoryAppStateRepository();
  const now = new Date(Date.UTC(2026, 2, 26));

  await repo.appendTrashEntries([
    { mediaStoreId: 'old', originalFolderBucketId: 'cam', deletedAt: now.getTime() - 40 * DAY },
    { mediaStoreId: 'new', originalFolderBucketId: 'cam', deletedAt: now.getTime() - 5 * DAY },
  ]);

  const useCase = new EnforceTrashRetentionUseCase(repo);
  const result = await useCase.execute(30, now);

  assert.equal(result.purgedCount, 1);
  assert.equal(result.remainingCount, 1);
});
