const test = require('node:test');
const assert = require('node:assert/strict');
const { UpdateSortingPreferencesUseCase } = require('../dist/domain/use-cases/update-sorting-preferences-use-case');

test('UpdateSortingPreferencesUseCase updates and clamps grid size', () => {
  const useCase = new UpdateSortingPreferencesUseCase();
  const current = { viewMode: 'single', swipeDeleteDirection: 'left', gridSize: 4 };

  const updated = useCase.execute({
    current,
    viewMode: 'grid',
    swipeDeleteDirection: 'right',
    gridSize: 20,
  });

  assert.equal(updated.viewMode, 'grid');
  assert.equal(updated.swipeDeleteDirection, 'right');
  assert.equal(updated.gridSize, 12);
});
