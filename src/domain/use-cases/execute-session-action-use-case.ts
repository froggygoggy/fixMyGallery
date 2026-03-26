import { PinnedSlot, SlotPosition } from '../models/pinned-slot';
import { SessionState } from '../models/session-state';
import { TrashEntry } from '../models/trash-entry';
import { UndoOperation } from '../models/undo-operation';
import { Point, PinnedSlotService } from '../services/pinned-slot-service';
import { SessionStateMachineService } from '../services/session-state-machine-service';
import { SortActionPlannerService } from '../services/sort-action-planner-service';
import { PlanActionOutcomeUseCase } from './plan-action-outcome-use-case';

export interface ExecuteSessionActionInput {
  sessionState: SessionState;
  selectedMediaIds: string[];
  swipeEndPoint?: Point;
  swipeDirection?: 'left' | 'right';
  deleteFallbackDirection: 'left' | 'right';
  pinnedSlots: PinnedSlot[];
  slotPositions: Record<SlotPosition, Point>;
  sourceFolderBucketId?: string;
  hitRadius: number;
  processedCountForProgress?: number;
  processedMinutesForProgress?: number;
  actionTimestampMs?: number;
}

export interface ExecuteSessionActionResult {
  nextState: SessionState;
  actionType: string;
  undo: UndoOperation;
  trashEntries: TrashEntry[];
}

export class ExecuteSessionActionUseCase {
  private readonly sortActionPlannerService: SortActionPlannerService;

  constructor(
    private readonly sessionStateMachineService: SessionStateMachineService = new SessionStateMachineService(),
    private readonly planActionOutcomeUseCase: PlanActionOutcomeUseCase = new PlanActionOutcomeUseCase(),
  ) {
    this.sortActionPlannerService = new SortActionPlannerService(new PinnedSlotService());
  }

  execute(input: ExecuteSessionActionInput): ExecuteSessionActionResult {
    const withSelection = this.sessionStateMachineService.transition(input.sessionState, {
      type: 'select',
      mediaIds: input.selectedMediaIds,
    });

    const action = this.sortActionPlannerService.plan({
      selectedMediaIds: input.selectedMediaIds,
      swipeEndPoint: input.swipeEndPoint,
      swipeDirection: input.swipeDirection,
      deleteFallbackDirection: input.deleteFallbackDirection,
      pinnedSlots: input.pinnedSlots,
      slotPositions: input.slotPositions,
      hitRadius: input.hitRadius,
    });

    const withPlannedAction = this.sessionStateMachineService.transition(withSelection, {
      type: 'plan_action',
      action,
    });

    const outcome = this.planActionOutcomeUseCase.execute({
      action,
      sourceFolderBucketId: input.sourceFolderBucketId,
      actionTimestampMs: input.actionTimestampMs,
    });

    const nextState = this.sessionStateMachineService.transition(withPlannedAction, {
      type: 'apply_action',
      processedCount: input.processedCountForProgress ?? input.selectedMediaIds.length,
      processedMinutes: input.processedMinutesForProgress,
    });

    return {
      nextState,
      actionType: action.type,
      undo: outcome.undo,
      trashEntries: outcome.trashEntries,
    };
  }
}
