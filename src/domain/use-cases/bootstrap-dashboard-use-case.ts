import { DashboardSummary } from '../models/dashboard-summary';
import { CleanupRepository } from '../repositories/cleanup-repository';
import { AppStateRepository } from '../repositories/app-state-repository';
import { DefaultProgressService } from '../services/default-progress-service';
import { ReminderDecisionService } from '../services/reminder-decision-service';

export interface BootstrapDashboardInput {
  now: Date;
  alreadyNotifiedToday: boolean;
}

export class BootstrapDashboardUseCase {
  constructor(
    private readonly cleanupRepository: CleanupRepository,
    private readonly appStateRepository: AppStateRepository,
    private readonly reminderDecisionService: ReminderDecisionService = new ReminderDecisionService(),
  ) {}

  async execute(input: BootstrapDashboardInput): Promise<DashboardSummary> {
    const config = await this.appStateRepository.loadOnboardingConfig();
    const newWindowDays = config?.newPhotosSettings.windowDays ?? 30;
    const progressService = new DefaultProgressService(this.cleanupRepository, newWindowDays, () => input.now.getTime());

    const [openOldCount, openNewCount, folderProgress] = await Promise.all([
      progressService.getOpenItemCount('old'),
      progressService.getOpenItemCount('new'),
      progressService.getFolderProgress(),
    ]);

    const reminderSettings =
      config?.reminderSettings ?? { enabled: true, mode: 'only_when_open_tasks' as const, timeOfDay: '19:00' };

    const reminderDecision = this.reminderDecisionService.shouldNotify({
      settings: reminderSettings,
      openItemsCount: openOldCount + openNewCount,
      now: input.now,
      alreadyNotifiedToday: input.alreadyNotifiedToday,
    });

    return {
      openOldCount,
      openNewCount,
      shouldNotifyNow: reminderDecision.shouldNotify,
      folderProgress,
    };
  }
}
