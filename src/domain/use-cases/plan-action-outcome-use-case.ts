import { SortAction } from '../models/sort-action';
import { TrashEntry } from '../models/trash-entry';
import { UndoOperation } from '../models/undo-operation';
import { TrashService } from '../services/trash-service';
import { UndoPlannerService } from '../services/undo-planner-service';

export interface PlanActionOutcomeInput {
  action: SortAction;
  sourceFolderBucketId?: string;
  actionTimestampMs?: number;
}

export interface PlanActionOutcomeResult {
  trashEntries: TrashEntry[];
  undo: UndoOperation;
}

export class PlanActionOutcomeUseCase {
  constructor(
    private readonly trashService: TrashService = new TrashService(),
    private readonly undoPlannerService: UndoPlannerService = new UndoPlannerService(),
  ) {}

  execute(input: PlanActionOutcomeInput): PlanActionOutcomeResult {
    const undo = this.undoPlannerService.plan({
      action: input.action,
      sourceFolderBucketId: input.sourceFolderBucketId,
    });

    const trashEntries =
      input.action.type === 'delete'
        ? this.trashService.createEntriesForDelete({
            mediaStoreIds: input.action.mediaStoreIds,
            sourceFolderBucketId: input.sourceFolderBucketId ?? 'unknown',
            deletedAtMs: input.actionTimestampMs,
          })
        : [];

    return {
      trashEntries,
      undo,
    };
  }
}
