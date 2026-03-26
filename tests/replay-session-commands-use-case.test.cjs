const test = require('node:test');
const assert = require('node:assert/strict');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');
const { SessionStateMachineService } = require('../dist/domain/services/session-state-machine-service');
const { ReplaySessionCommandsUseCase } = require('../dist/domain/use-cases/replay-session-commands-use-case');

test('ReplaySessionCommandsUseCase reapplies progress deltas from command log', async () => {
  const appRepo = new InMemoryAppStateRepository();
  await appRepo.appendSessionCommandLog({
    id: '1',
    actionType: 'delete',
    mediaStoreIds: ['m1'],
    timestampMs: Date.UTC(2026, 2, 26, 12, 0, 0),
    statusBefore: 'running',
    statusAfter: 'running',
    processedCountDelta: 1,
    processedMinutesDelta: 0,
  });
  await appRepo.appendSessionCommandLog({
    id: '2',
    actionType: 'move_to_folder',
    mediaStoreIds: ['m2'],
    timestampMs: Date.UTC(2026, 2, 26, 12, 1, 0),
    statusBefore: 'running',
    statusAfter: 'running',
    processedCountDelta: 1,
    processedMinutesDelta: 0,
  });

  const sm = new SessionStateMachineService();
  const initial = sm.transition(sm.getInitialState(), {
    type: 'start',
    queueMediaIds: ['m1', 'm2', 'm3'],
    targetType: 'count',
    targetValue: 3,
  });

  const useCase = new ReplaySessionCommandsUseCase(appRepo);
  const replayResult = await useCase.execute(initial);

  assert.equal(replayResult.replayedCommands.length, 2);
  assert.equal(replayResult.state.progress.processedCount, 2);
  assert.equal(replayResult.state.status, 'running');
});
