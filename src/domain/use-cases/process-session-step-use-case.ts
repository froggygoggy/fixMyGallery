import { DashboardSummary } from '../models/dashboard-summary';
import { PinnedSlot, SlotPosition } from '../models/pinned-slot';
import { SessionState } from '../models/session-state';
import { AppStateRepository } from '../repositories/app-state-repository';
import { CleanupRepository } from '../repositories/cleanup-repository';
import { Point } from '../services/pinned-slot-service';
import { BootstrapDashboardUseCase } from './bootstrap-dashboard-use-case';
import { ExecuteSessionActionInput, ExecuteSessionActionUseCase } from './execute-session-action-use-case';
import { LogSessionCommandUseCase } from './log-session-command-use-case';

export interface ProcessSessionStepInput {
  sessionState: SessionState;
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

export interface ProcessSessionStepResult {
  nextState: SessionState;
  dashboard: DashboardSummary;
  undoHistoryCount: number;
  trashCount: number;
}

export class ProcessSessionStepUseCase {
  private readonly executeSessionActionUseCase: ExecuteSessionActionUseCase;
  private readonly bootstrapDashboardUseCase: BootstrapDashboardUseCase;
  private readonly logSessionCommandUseCase: LogSessionCommandUseCase;

  constructor(
    private readonly cleanupRepository: CleanupRepository,
    private readonly appStateRepository: AppStateRepository,
  ) {
    this.executeSessionActionUseCase = new ExecuteSessionActionUseCase();
    this.bootstrapDashboardUseCase = new BootstrapDashboardUseCase(cleanupRepository, appStateRepository);
    this.logSessionCommandUseCase = new LogSessionCommandUseCase(appStateRepository);
  }

  async execute(input: ProcessSessionStepInput): Promise<ProcessSessionStepResult> {
    const actionResult = this.executeSessionActionUseCase.execute({
      sessionState: input.sessionState,
      selectedMediaIds: input.selectedMediaIds,
      swipeEndPoint: input.swipeEndPoint,
      swipeDirection: input.swipeDirection,
      deleteFallbackDirection: input.deleteFallbackDirection,
      pinnedSlots: input.pinnedSlots,
      slotPositions: input.slotPositions,
      sourceFolderBucketId: input.sourceFolderBucketId,
      hitRadius: input.hitRadius,
    } as ExecuteSessionActionInput);

    await this.appStateRepository.appendTrashEntries(actionResult.trashEntries);
    await this.appStateRepository.appendUndoHistoryEntry({
      id: `${input.now.getTime()}-${actionResult.actionType}`,
      operationType: actionResult.undo.type,
      mediaStoreIds: actionResult.undo.mediaStoreIds,
      sourceFolderBucketId: actionResult.undo.sourceFolderBucketId,
      createdAt: input.now.getTime(),
    });
    await this.logSessionCommandUseCase.execute({
      previousState: input.sessionState,
      nextState: actionResult.nextState,
      actionType: actionResult.actionType,
      selectedMediaIds: input.selectedMediaIds,
      timestampMs: input.now.getTime(),
      processedCountDelta: input.selectedMediaIds.length,
      processedMinutesDelta: 0,
    });

    const [dashboard, trashEntries, undoHistory] = await Promise.all([
      this.bootstrapDashboardUseCase.execute({
        now: input.now,
        alreadyNotifiedToday: input.alreadyNotifiedToday,
      }),
      this.appStateRepository.loadTrashEntries(),
      this.appStateRepository.loadUndoHistory(),
    ]);

    return {
      nextState: actionResult.nextState,
      dashboard,
      undoHistoryCount: undoHistory.length,
      trashCount: trashEntries.length,
    };
  }
}
