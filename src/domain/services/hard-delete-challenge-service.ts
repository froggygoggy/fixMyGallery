export interface HardDeleteChallenge {
  challengeText: string;
  helperText: string;
}

export class HardDeleteChallengeService {
  build(selectedCount: number): HardDeleteChallenge {
    const safeCount = Math.max(0, Math.floor(selectedCount));
    return {
      challengeText: `DELETE ${safeCount}`,
      helperText: `Tippe "DELETE ${safeCount}" zur Bestätigung ein.`,
    };
  }

  verify(inputText: string, challengeText: string): boolean {
    return inputText.trim().toUpperCase() === challengeText.trim().toUpperCase();
  }
}
