import { AppStateRepository } from '../repositories/app-state-repository';
import { CompleteOnboardingInput, CompleteOnboardingResult, CompleteOnboardingUseCase } from './complete-onboarding-use-case';

export class PersistOnboardingUseCase {
  constructor(
    private readonly appStateRepository: AppStateRepository,
    private readonly completeOnboardingUseCase: CompleteOnboardingUseCase = new CompleteOnboardingUseCase(),
  ) {}

  async execute(input: CompleteOnboardingInput): Promise<CompleteOnboardingResult> {
    const result = this.completeOnboardingUseCase.execute(input);

    if (result.ok && result.config) {
      await this.appStateRepository.saveOnboardingConfig(result.config);
    }

    return result;
  }
}
