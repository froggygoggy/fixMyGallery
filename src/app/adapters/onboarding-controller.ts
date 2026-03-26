import { PersistOnboardingUseCase } from '../../domain/use-cases/persist-onboarding-use-case';
import { CompleteOnboardingInput } from '../../domain/use-cases/complete-onboarding-use-case';

export interface OnboardingSubmitResult {
  success: boolean;
  errors: string[];
}

export class OnboardingController {
  constructor(private readonly persistOnboardingUseCase: PersistOnboardingUseCase) {}

  async submit(input: CompleteOnboardingInput): Promise<OnboardingSubmitResult> {
    const result = await this.persistOnboardingUseCase.execute(input);

    if (!result.ok) {
      return {
        success: false,
        errors: result.errors ?? ['Unknown onboarding error.'],
      };
    }

    return {
      success: true,
      errors: [],
    };
  }
}
