import { DashboardSummary } from './dashboard-summary';
import { SessionQueueItem } from './session-queue-item';
import { SessionState } from './session-state';

export interface Sprint2FlowReport {
  onboardingCompleted: boolean;
  initialDashboard: DashboardSummary;
  queueSize: number;
  firstQueueItems: SessionQueueItem[];
  sessionStateAfterFirstAction: SessionState;
  dashboardAfterFirstAction: DashboardSummary;
  trashCount: number;
  undoHistoryCount: number;
}
