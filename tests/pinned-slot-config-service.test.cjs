const test = require('node:test');
const assert = require('node:assert/strict');
const { PinnedSlotConfigService } = require('../dist/domain/services/pinned-slot-config-service');

test('PinnedSlotConfigService validates duplicate delete slots', () => {
  const service = new PinnedSlotConfigService();

  const result = service.validate([
    { position: 'left_center', actionType: 'delete', enabled: true },
    { position: 'right_center', actionType: 'delete', enabled: true },
  ]);

  assert.equal(result.valid, false);
  assert.equal(result.errors.includes('Only one delete slot is allowed.'), true);
});
