import { SessionState } from '../models/session-state';
import { SortAction } from '../models/sort-action';

export type SessionEvent =
  | { type: 'start'; queueMediaIds: string[]; targetType: 'count' | 'time'; targetValue: number }
  | { type: 'select'; mediaIds: string[] }
  | { type: 'plan_action'; action: SortAction }
  | { type: 'apply_action'; processedCount: number; processedMinutes?: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'complete' };

const initialState: SessionState = {
  status: 'idle',
  queueMediaIds: [],
  selectedMediaIds: [],
  progress: {
    processedCount: 0,
    processedMinutes: 0,
    targetType: 'count',
    targetValue: 1,
  },
};

export class SessionStateMachineService {
  transition(state: SessionState = initialState, event: SessionEvent): SessionState {
    switch (event.type) {
      case 'start': {
        return {
          status: 'running',
          queueMediaIds: event.queueMediaIds,
          selectedMediaIds: [],
          lastPlannedAction: undefined,
          progress: {
            processedCount: 0,
            processedMinutes: 0,
            targetType: event.targetType,
            targetValue: Math.max(1, event.targetValue),
          },
        };
      }

      case 'select': {
        if (state.status === 'idle' || state.status === 'completed') {
          return state;
        }

        return {
          ...state,
          selectedMediaIds: event.mediaIds,
          status: 'running',
        };
      }

      case 'plan_action': {
        if (state.status === 'idle' || state.status === 'completed') {
          return state;
        }

        return {
          ...state,
          lastPlannedAction: event.action,
          status: 'action_planned',
        };
      }

      case 'apply_action': {
        if (state.status === 'idle' || state.status === 'completed') {
          return state;
        }

        const nextCount = state.progress.processedCount + Math.max(0, event.processedCount);
        const nextMinutes = state.progress.processedMinutes + Math.max(0, event.processedMinutes ?? 0);
        const currentValue = state.progress.targetType === 'count' ? nextCount : nextMinutes;
        const goalReached = currentValue >= state.progress.targetValue;

        return {
          ...state,
          selectedMediaIds: [],
          lastPlannedAction: undefined,
          status: goalReached ? 'goal_reached' : 'running',
          progress: {
            ...state.progress,
            processedCount: nextCount,
            processedMinutes: nextMinutes,
          },
        };
      }

      case 'pause': {
        if (state.status === 'running' || state.status === 'action_planned' || state.status === 'goal_reached') {
          return { ...state, status: 'paused' };
        }

        return state;
      }

      case 'resume': {
        if (state.status === 'paused') {
          return { ...state, status: 'running' };
        }

        return state;
      }

      case 'complete': {
        if (state.status === 'idle') {
          return state;
        }

        return {
          ...state,
          status: 'completed',
          selectedMediaIds: [],
          lastPlannedAction: undefined,
        };
      }
    }
  }

  getInitialState(): SessionState {
    return initialState;
  }
}
