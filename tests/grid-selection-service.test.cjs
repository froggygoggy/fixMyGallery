const test = require('node:test');
const assert = require('node:assert/strict');
const { GridSelectionService } = require('../dist/domain/services/grid-selection-service');

test('GridSelectionService toggles and clears selections', () => {
  const service = new GridSelectionService();

  const afterAdd = service.toggleSelection([], 'm1');
  assert.deepEqual(afterAdd, ['m1']);

  const afterRemove = service.toggleSelection(afterAdd, 'm1');
  assert.deepEqual(afterRemove, []);

  const selectedAll = service.selectAll([], ['m1', 'm2']);
  assert.deepEqual(selectedAll.sort(), ['m1', 'm2']);

  assert.deepEqual(service.clearSelection(), []);
});
