import { HardDeleteChallenge, HardDeleteChallengeService } from '../services/hard-delete-challenge-service';

export interface VerifyHardDeleteChallengeResult {
  challenge: HardDeleteChallenge;
  valid: boolean;
}

export class VerifyHardDeleteChallengeUseCase {
  constructor(private readonly service: HardDeleteChallengeService = new HardDeleteChallengeService()) {}

  execute(selectedCount: number, typedText: string): VerifyHardDeleteChallengeResult {
    const challenge = this.service.build(selectedCount);
    return {
      challenge,
      valid: this.service.verify(typedText, challenge.challengeText),
    };
  }
}
