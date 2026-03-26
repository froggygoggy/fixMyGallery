import { SessionStatus } from './session-state';

export interface SessionCommandLogEntry {
  id: string;
  actionType: string;
  mediaStoreIds: string[];
  timestampMs: number;
  statusBefore: SessionStatus;
  statusAfter: SessionStatus;
  processedCountDelta: number;
  processedMinutesDelta: number;
}
