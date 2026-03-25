import { PlanSettings } from '../models/plan-settings';

export interface GoalProgressInput {
  plan: PlanSettings;
  processedCount: number;
  processedMinutes: number;
}

export interface GoalProgress {
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completionRatio: number;
}

export interface GoalTrackingService {
  evaluateProgress(input: GoalProgressInput): GoalProgress;
}

export class DefaultGoalTrackingService implements GoalTrackingService {
  evaluateProgress(input: GoalProgressInput): GoalProgress {
    const targetValue = Math.max(1, input.plan.quotaValue);
    const currentValue = input.plan.quotaType === 'count' ? input.processedCount : input.processedMinutes;
    const completionRatio = Math.min(1, currentValue / targetValue);

    return {
      targetValue,
      currentValue,
      completed: currentValue >= targetValue,
      completionRatio,
    };
  }
}
