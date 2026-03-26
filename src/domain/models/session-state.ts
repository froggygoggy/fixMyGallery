import { SortAction } from './sort-action';

export type SessionStatus = 'idle' | 'running' | 'action_planned' | 'goal_reached' | 'paused' | 'completed';

export interface SessionProgress {
  processedCount: number;
  processedMinutes: number;
  targetValue: number;
  targetType: 'count' | 'time';
}

export interface SessionState {
  status: SessionStatus;
  queueMediaIds: string[];
  selectedMediaIds: string[];
  lastPlannedAction?: SortAction;
  progress: SessionProgress;
}
