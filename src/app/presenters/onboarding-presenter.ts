import { OnboardingController } from '../adapters/onboarding-controller';
import { CompleteOnboardingInput } from '../../domain/use-cases/complete-onboarding-use-case';
import { ErrorPresenter } from './error-presenter';
import { de } from '../i18n/de';

export interface OnboardingViewState {
  success: boolean;
  title: string;
  message: string;
  errors: string[];
}

export class OnboardingPresenter {
  constructor(
    private readonly controller: OnboardingController,
    private readonly errorPresenter: ErrorPresenter = new ErrorPresenter(),
  ) {}

  async submit(input: CompleteOnboardingInput): Promise<OnboardingViewState> {
    const result = await this.controller.submit(input);

    if (!result.success) {
      return {
        success: false,
        title: de.onboarding.title,
        message: de.onboarding.validationError,
        errors: this.errorPresenter.toUserMessages(result.errors),
      };
    }

    return {
      success: true,
      title: de.onboarding.title,
      message: de.onboarding.success,
      errors: [],
    };
  }
}
