import { PinnedSlot, SlotPosition } from '../../domain/models/pinned-slot';
import { SessionState } from '../../domain/models/session-state';
import { Point } from '../../domain/services/pinned-slot-service';
import { ProcessSessionStepUseCase } from '../../domain/use-cases/process-session-step-use-case';

export interface SessionActionRequest {
  state: SessionState;
  selectedMediaIds: string[];
  swipeEndPoint?: Point;
  swipeDirection?: 'left' | 'right';
  deleteFallbackDirection: 'left' | 'right';
  pinnedSlots: PinnedSlot[];
  slotPositions: Record<SlotPosition, Point>;
  sourceFolderBucketId?: string;
  hitRadius: number;
  now: Date;
  alreadyNotifiedToday: boolean;
}

export interface SessionActionViewModel {
  nextState: SessionState;
  undoHistoryCount: number;
  trashCount: number;
  dashboardHeadline: string;
}

export class SessionController {
  constructor(private readonly processSessionStepUseCase: ProcessSessionStepUseCase) {}

  async applyAction(request: SessionActionRequest): Promise<SessionActionViewModel> {
    const result = await this.processSessionStepUseCase.execute({
      sessionState: request.state,
      selectedMediaIds: request.selectedMediaIds,
      swipeEndPoint: request.swipeEndPoint,
      swipeDirection: request.swipeDirection,
      deleteFallbackDirection: request.deleteFallbackDirection,
      pinnedSlots: request.pinnedSlots,
      slotPositions: request.slotPositions,
      sourceFolderBucketId: request.sourceFolderBucketId,
      hitRadius: request.hitRadius,
      now: request.now,
      alreadyNotifiedToday: request.alreadyNotifiedToday,
    });

    const totalOpen = result.dashboard.openOldCount + result.dashboard.openNewCount;

    return {
      nextState: result.nextState,
      undoHistoryCount: result.undoHistoryCount,
      trashCount: result.trashCount,
      dashboardHeadline: totalOpen === 0 ? 'Alles erledigt 🎉' : `Noch ${totalOpen} Aufgaben offen`,
    };
  }
}
