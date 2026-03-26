const test = require('node:test');
const assert = require('node:assert/strict');
const { ApplySessionTimeProgressUseCase } = require('../dist/domain/use-cases/apply-session-time-progress-use-case');
const { SessionStateMachineService } = require('../dist/domain/services/session-state-machine-service');

test('ApplySessionTimeProgressUseCase credits time and reaches time goal', () => {
  const sm = new SessionStateMachineService();
  const start = sm.transition(sm.getInitialState(), {
    type: 'start',
    queueMediaIds: ['m1'],
    targetType: 'time',
    targetValue: 2,
  });

  const useCase = new ApplySessionTimeProgressUseCase();
  const result = useCase.execute(start, 2 * 60 * 1000);

  assert.equal(result.creditedMinutes, 2);
  assert.equal(result.nextState.status, 'goal_reached');
});
