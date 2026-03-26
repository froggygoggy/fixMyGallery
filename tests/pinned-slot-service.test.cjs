const test = require('node:test');
const assert = require('node:assert/strict');
const { PinnedSlotService } = require('../dist/domain/services/pinned-slot-service');

test('PinnedSlotService resolves closest hit by configured positions', () => {
  const service = new PinnedSlotService();

  const resolved = service.resolveTarget({
    end: { x: 5, y: 100 },
    hitRadius: 20,
    slots: [
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

  assert.equal(resolved.matched, true);
  assert.equal(resolved.slot.actionType, 'delete');
});
