const test = require('node:test');
const assert = require('node:assert/strict');
const { SwipeIntentService } = require('../dist/domain/services/swipe-intent-service');

test('SwipeIntentService maps swipe direction to intent', () => {
  const service = new SwipeIntentService();

  assert.equal(service.resolveIntent('left', 'left'), 'delete');
  assert.equal(service.resolveIntent('right', 'left'), 'open_folder_drawer');
});
