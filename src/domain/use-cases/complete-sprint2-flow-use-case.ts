import { PinnedSlot } from '../models/pinned-slot';
import { SessionState } from '../models/session-state';
import { Sprint2FlowReport } from '../models/sprint2-flow-report';
import { AppStateRepository } from '../repositories/app-state-repository';
import { CleanupRepository } from '../repositories/cleanup-repository';
import { SessionStateMachineService } from '../services/session-state-machine-service';
import { BootstrapDashboardUseCase } from './bootstrap-dashboard-use-case';
import { CompleteOnboardingInput } from './complete-onboarding-use-case';
import { PersistOnboardingUseCase } from './persist-onboarding-use-case';
import { ProcessSessionStepUseCase } from './process-session-step-use-case';
import { StartSessionUseCase } from './start-session-use-case';

export interface CompleteSprint2FlowInput {
  onboarding: CompleteOnboardingInput;
  mode: 'old' | 'new';
  now: Date;
  pinnedSlots: PinnedSlot[];
  deleteFallbackDirection: 'left' | 'right';
  alreadyNotifiedToday: boolean;
}

export class CompleteSprint2FlowUseCase {
  private readonly persistOnboardingUseCase: PersistOnboardingUseCase;
  private readonly bootstrapDashboardUseCase: BootstrapDashboardUseCase;
  private readonly startSessionUseCase: StartSessionUseCase;
  private readonly processSessionStepUseCase: ProcessSessionStepUseCase;
  private readonly stateMachine = new SessionStateMachineService();

  constructor(
    private readonly cleanupRepository: CleanupRepository,
    private readonly appStateRepository: AppStateRepository,
  ) {
    this.persistOnboardingUseCase = new PersistOnboardingUseCase(appStateRepository);
    this.bootstrapDashboardUseCase = new BootstrapDashboardUseCase(cleanupRepository, appStateRepository);
    this.startSessionUseCase = new StartSessionUseCase(cleanupRepository);
    this.processSessionStepUseCase = new ProcessSessionStepUseCase(cleanupRepository, appStateRepository);
  }

  async execute(input: CompleteSprint2FlowInput): Promise<Sprint2FlowReport> {
    const onboardingResult = await this.persistOnboardingUseCase.execute(input.onboarding);

    if (!onboardingResult.ok || !onboardingResult.config) {
      throw new Error(`Onboarding failed: ${(onboardingResult.errors ?? []).join(', ')}`);
    }

    const initialDashboard = await this.bootstrapDashboardUseCase.execute({
      now: input.now,
      alreadyNotifiedToday: input.alreadyNotifiedToday,
    });

    const folderUsage = await this.appStateRepository.loadFolderUsage();
    const sessionBootstrap = await this.startSessionUseCase.execute({
      mode: input.mode,
      selectedFolderBucketIds: onboardingResult.config.onboardingState.selectedFolderBucketIds,
      folderUsage,
      nowMs: input.now.getTime(),
      newWindowDays: onboardingResult.config.newPhotosSettings.windowDays,
    });

    const firstQueueItems = sessionBootstrap.queue.slice(0, 5);
    const firstSelected = sessionBootstrap.queue.slice(0, 1).map((item) => item.mediaStoreId);

    const startState: SessionState = this.stateMachine.transition(this.stateMachine.getInitialState(), {
      type: 'start',
      queueMediaIds: sessionBootstrap.queue.map((item) => item.mediaStoreId),
      targetType: 'count',
      targetValue: 1,
    });

    const processResult = await this.processSessionStepUseCase.execute({
      sessionState: startState,
      selectedMediaIds: firstSelected,
      swipeDirection: input.deleteFallbackDirection,
      deleteFallbackDirection: input.deleteFallbackDirection,
      pinnedSlots: input.pinnedSlots,
      slotPositions: {
        left_center: { x: 0, y: 100 },
        right_center: { x: 300, y: 100 },
        top_left: { x: 0, y: 0 },
        top_center: { x: 150, y: 0 },
        bottom_left: { x: 0, y: 200 },
        bottom_center: { x: 150, y: 200 },
      },
      sourceFolderBucketId: onboardingResult.config.onboardingState.selectedFolderBucketIds[0],
      hitRadius: 24,
      now: input.now,
      alreadyNotifiedToday: input.alreadyNotifiedToday,
    });

    return {
      onboardingCompleted: onboardingResult.config.onboardingState.completed,
      initialDashboard,
      queueSize: sessionBootstrap.queue.length,
      firstQueueItems,
      sessionStateAfterFirstAction: processResult.nextState,
      dashboardAfterFirstAction: processResult.dashboard,
      trashCount: processResult.trashCount,
      undoHistoryCount: processResult.undoHistoryCount,
    };
  }
}
