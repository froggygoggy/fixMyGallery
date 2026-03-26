import { UndoLastActionUseCase } from './undo-last-action-use-case';

export interface UndoMultipleActionsResult {
  undoneCount: number;
  restoredFromTrashCount: number;
}

export class UndoMultipleActionsUseCase {
  constructor(private readonly undoLastActionUseCase: UndoLastActionUseCase) {}

  async execute(maxActions: number): Promise<UndoMultipleActionsResult> {
    let undoneCount = 0;
    let restoredFromTrashCount = 0;

    for (let i = 0; i < Math.max(0, maxActions); i += 1) {
      const result = await this.undoLastActionUseCase.execute();
      if (!result.undone) {
        break;
      }

      undoneCount += 1;
      restoredFromTrashCount += result.restoredFromTrashCount ?? 0;
    }

    return {
      undoneCount,
      restoredFromTrashCount,
    };
  }
}
