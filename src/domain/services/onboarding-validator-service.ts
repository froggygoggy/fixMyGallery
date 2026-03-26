import { NewPhotosSettings } from '../models/new-photos-settings';
import { PlanSettings } from '../models/plan-settings';
import { ReminderSettings } from '../models/reminder-settings';

export interface OnboardingValidationInput {
  selectedFolderBucketIds: string[];
  oldCleanupPlan: PlanSettings;
  newCleanupPlan: PlanSettings;
  reminderSettings: ReminderSettings;
  newPhotosSettings: NewPhotosSettings;
}

export interface OnboardingValidationResult {
  valid: boolean;
  errors: string[];
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class OnboardingValidatorService {
  validate(input: OnboardingValidationInput): OnboardingValidationResult {
    const errors: string[] = [];

    if (input.selectedFolderBucketIds.length === 0) {
      errors.push('At least one folder must be selected.');
    }

    if (input.oldCleanupPlan.quotaValue <= 0) {
      errors.push('Old cleanup plan quota must be greater than zero.');
    }

    if (input.newCleanupPlan.quotaValue <= 0) {
      errors.push('New cleanup plan quota must be greater than zero.');
    }

    if (!TIME_REGEX.test(input.reminderSettings.timeOfDay)) {
      errors.push('Reminder time must be in HH:mm format.');
    }


    const reminderFrequency = input.reminderSettings.frequency ?? 'daily';

    if (reminderFrequency !== 'daily' && reminderFrequency !== 'weekly') {
      errors.push('Reminder frequency must be daily or weekly.');
    }

    if (reminderFrequency === 'weekly') {
      const weekday = input.reminderSettings.weekday;
      if (weekday === undefined || weekday < 0 || weekday > 6) {
        errors.push('Weekly reminder weekday must be between 0 and 6.');
      }
    }

    if (input.newPhotosSettings.windowDays <= 0) {
      errors.push('New photos window days must be greater than zero.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
