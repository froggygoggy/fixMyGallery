import { NewPhotosSettings } from './new-photos-settings';
import { OnboardingState } from './onboarding-state';
import { PlanSettings } from './plan-settings';
import { ReminderSettings } from './reminder-settings';

export interface OnboardingConfig {
  onboardingState: OnboardingState;
  oldCleanupPlan: PlanSettings;
  newCleanupPlan: PlanSettings;
  reminderSettings: ReminderSettings;
  newPhotosSettings: NewPhotosSettings;
}
