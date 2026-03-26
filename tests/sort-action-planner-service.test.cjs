const test = require('node:test');
const assert = require('node:assert/strict');
const { SortActionPlannerService } = require('../dist/domain/services/sort-action-planner-service');

test('SortActionPlannerService chooses pinned delete slot over fallback', () => {
  const service = new SortActionPlannerService();

  const action = service.plan({
    selectedMediaIds: ['m1', 'm2'],
    swipeEndPoint: { x: 3, y: 100 },
    swipeDirection: 'right',
    deleteFallbackDirection: 'left',
    hitRadius: 20,
    pinnedSlots: [
      { position: 'left_center', actionType: 'delete', enabled: true },
      { position: 'right_center', actionType: 'open_folder_drawer', enabled: true },
    ],
    slotPositions: {
      left_center: { x: 0, y: 100 },
      right_center: { x: 300, y: 100 },
      top_left: { x: 0, y: 0 },
      top_center: { x: 150, y: 0 },
      bottom_left: { x: 0, y: 200 },
      bottom_center: { x: 150, y: 200 },
    },
  });

  assert.equal(action.type, 'delete');
  assert.deepEqual(action.mediaStoreIds, ['m1', 'm2']);
});

test('SortActionPlannerService falls back to folder drawer when no delete direction hit', () => {
  const service = new SortActionPlannerService();

  const action = service.plan({
    selectedMediaIds: ['m1'],
    swipeDirection: 'right',
    deleteFallbackDirection: 'left',
    hitRadius: 20,
    pinnedSlots: [],
    slotPositions: {
      left_center: { x: 0, y: 100 },
      right_center: { x: 300, y: 100 },
      top_left: { x: 0, y: 0 },
      top_center: { x: 150, y: 0 },
      bottom_left: { x: 0, y: 200 },
      bottom_center: { x: 150, y: 200 },
    },
  });

  assert.equal(action.type, 'open_folder_drawer');
});
