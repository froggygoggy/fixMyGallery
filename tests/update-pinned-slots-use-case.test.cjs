const test = require('node:test');
const assert = require('node:assert/strict');
const { UpdatePinnedSlotsUseCase } = require('../dist/domain/use-cases/update-pinned-slots-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('UpdatePinnedSlotsUseCase stores valid slot config', async () => {
  const repo = new InMemoryAppStateRepository();
  const useCase = new UpdatePinnedSlotsUseCase(repo);

  const result = await useCase.execute([
    { position: 'left_center', actionType: 'delete', enabled: true },
    { position: 'right_center', actionType: 'open_folder_drawer', enabled: true },
  ]);

  assert.equal(result.ok, true);
  const stored = await repo.loadPinnedSlots();
  assert.equal(stored.length, 2);
});
