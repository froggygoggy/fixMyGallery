const test = require('node:test');
const assert = require('node:assert/strict');
const { SuggestPinnedSlotsUseCase } = require('../dist/domain/use-cases/suggest-pinned-slots-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('SuggestPinnedSlotsUseCase proposes slots from stored folder usage', async () => {
  const repo = new InMemoryAppStateRepository();
  await repo.saveFolderUsage([
    { folderBucketId: 'family', useCount: 20, lastUsedAt: 1000 },
    { folderBucketId: 'work', useCount: 10, lastUsedAt: 2000 },
  ]);

  const useCase = new SuggestPinnedSlotsUseCase(repo);
  const slots = await useCase.execute([{ position: 'left_center', actionType: 'delete', enabled: true }]);

  assert.equal(slots.length > 0, true);
  assert.equal(slots[0].actionType, 'move_to_folder');
});
