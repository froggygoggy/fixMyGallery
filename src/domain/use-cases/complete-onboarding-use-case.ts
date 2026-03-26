import { NewPhotosSettings } from '../models/new-photos-settings';
import { OnboardingConfig } from '../models/onboarding-config';
import { OnboardingState } from '../models/onboarding-state';
import { PlanSettings } from '../models/plan-settings';
import { ReminderSettings } from '../models/reminder-settings';
import { OnboardingValidatorService } from '../services/onboarding-validator-service';

export interface CompleteOnboardingInput {
  selectedFolderBucketIds: string[];
  oldCleanupPlan: PlanSettings;
  newCleanupPlan: PlanSettings;
  reminderSettings: ReminderSettings;
  newPhotosSettings?: NewPhotosSettings;
  completedAtMs?: number;
}

export interface CompleteOnboardingResult {
  ok: boolean;
  config?: OnboardingConfig;
  errors?: string[];
}

export class CompleteOnboardingUseCase {
  constructor(private readonly validator: OnboardingValidatorService = new OnboardingValidatorService()) {}

  execute(input: CompleteOnboardingInput): CompleteOnboardingResult {
    const newPhotosSettings = input.newPhotosSettings ?? { windowDays: 30 };

    const validation = this.validator.validate({
      selectedFolderBucketIds: input.selectedFolderBucketIds,
      oldCleanupPlan: input.oldCleanupPlan,
      newCleanupPlan: input.newCleanupPlan,
      reminderSettings: input.reminderSettings,
      newPhotosSettings,
    });

    if (!validation.valid) {
      return {
        ok: false,
        errors: validation.errors,
      };
    }

    const onboardingState: OnboardingState = {
      completed: true,
      completedAt: input.completedAtMs ?? Date.now(),
      selectedFolderBucketIds: input.selectedFolderBucketIds,
    };

    return {
      ok: true,
      config: {
        onboardingState,
        oldCleanupPlan: input.oldCleanupPlan,
        newCleanupPlan: input.newCleanupPlan,
        reminderSettings: input.reminderSettings,
        newPhotosSettings,
      },
    };
  }
}
