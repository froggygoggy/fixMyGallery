const test = require('node:test');
const assert = require('node:assert/strict');
const { SortingSessionPresenter } = require('../dist/app/presenters/sorting-session-presenter');

test('SortingSessionPresenter maps preferences and selection to screen state', () => {
  const presenter = new SortingSessionPresenter();
  const state = presenter.toScreenState({
    preferences: { viewMode: 'grid', swipeDeleteDirection: 'left', gridSize: 6 },
    selectedMediaIds: ['m1', 'm2'],
    bulkActionPreview: { selectedCount: 2, actionLabel: 'Verschieben', requiresConfirmation: false },
  });

  assert.equal(state.viewMode, 'grid');
  assert.equal(state.selectionCount, 2);
  assert.equal(state.bulkActionPreview.actionLabel, 'Verschieben');
});
