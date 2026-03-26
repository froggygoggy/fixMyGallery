const test = require('node:test');
const assert = require('node:assert/strict');
const { SessionStateMachineService } = require('../dist/domain/services/session-state-machine-service');

test('SessionStateMachineService reaches goal for count target', () => {
  const sm = new SessionStateMachineService();
  let state = sm.getInitialState();

  state = sm.transition(state, { type: 'start', queueMediaIds: ['m1', 'm2'], targetType: 'count', targetValue: 2 });
  state = sm.transition(state, { type: 'select', mediaIds: ['m1'] });
  state = sm.transition(state, { type: 'plan_action', action: { type: 'delete', mediaStoreIds: ['m1'] } });
  state = sm.transition(state, { type: 'apply_action', processedCount: 1 });

  assert.equal(state.status, 'running');
  assert.equal(state.progress.processedCount, 1);

  state = sm.transition(state, { type: 'apply_action', processedCount: 1 });
  assert.equal(state.status, 'goal_reached');
  assert.equal(state.progress.processedCount, 2);
});

test('SessionStateMachineService handles pause/resume/complete', () => {
  const sm = new SessionStateMachineService();
  let state = sm.transition(sm.getInitialState(), {
    type: 'start',
    queueMediaIds: ['m1'],
    targetType: 'time',
    targetValue: 5,
  });

  state = sm.transition(state, { type: 'pause' });
  assert.equal(state.status, 'paused');

  state = sm.transition(state, { type: 'resume' });
  assert.equal(state.status, 'running');

  state = sm.transition(state, { type: 'complete' });
  assert.equal(state.status, 'completed');
});
