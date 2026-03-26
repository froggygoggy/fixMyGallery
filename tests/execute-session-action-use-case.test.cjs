const test = require('node:test');
const assert = require('node:assert/strict');
const { ExecuteSessionActionUseCase } = require('../dist/domain/use-cases/execute-session-action-use-case');
const { SessionStateMachineService } = require('../dist/domain/services/session-state-machine-service');

function slotPositions() {
  return {
    left_center: { x: 0, y: 100 },
    right_center: { x: 300, y: 100 },
    top_left: { x: 0, y: 0 },
    top_center: { x: 150, y: 0 },
    bottom_left: { x: 0, y: 200 },
    bottom_center: { x: 150, y: 200 },
  };
}

test('ExecuteSessionActionUseCase deletes on pinned delete slot and creates trash entries', () => {
  const stateMachine = new SessionStateMachineService();
  const startState = stateMachine.transition(stateMachine.getInitialState(), {
    type: 'start',
    queueMediaIds: ['m1', 'm2', 'm3'],
    targetType: 'count',
    targetValue: 3,
  });

  const useCase = new ExecuteSessionActionUseCase();
  const result = useCase.execute({
    sessionState: startState,
    selectedMediaIds: ['m1', 'm2'],
    swipeEndPoint: { x: 1, y: 100 },
    swipeDirection: 'right',
    deleteFallbackDirection: 'left',
    pinnedSlots: [{ position: 'left_center', actionType: 'delete', enabled: true }],
    slotPositions: slotPositions(),
    sourceFolderBucketId: 'cam',
    hitRadius: 20,
  });

  assert.equal(result.actionType, 'delete');
  assert.equal(result.undo.type, 'restore_from_trash');
  assert.equal(result.trashEntries.length, 2);
  assert.equal(result.nextState.progress.processedCount, 2);
});

test('ExecuteSessionActionUseCase opens folder drawer when swipe is not delete direction', () => {
  const stateMachine = new SessionStateMachineService();
  const startState = stateMachine.transition(stateMachine.getInitialState(), {
    type: 'start',
    queueMediaIds: ['m1'],
    targetType: 'count',
    targetValue: 1,
  });

  const useCase = new ExecuteSessionActionUseCase();
  const result = useCase.execute({
    sessionState: startState,
    selectedMediaIds: ['m1'],
    swipeDirection: 'right',
    deleteFallbackDirection: 'left',
    pinnedSlots: [],
    slotPositions: slotPositions(),
    sourceFolderBucketId: 'cam',
    hitRadius: 20,
  });

  assert.equal(result.actionType, 'open_folder_drawer');
  assert.equal(result.undo.type, 'none');
  assert.equal(result.trashEntries.length, 0);
  assert.equal(result.nextState.status, 'goal_reached');
});
