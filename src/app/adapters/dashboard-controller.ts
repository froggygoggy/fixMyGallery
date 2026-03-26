import { DashboardSummary } from '../../domain/models/dashboard-summary';
import { BootstrapDashboardUseCase } from '../../domain/use-cases/bootstrap-dashboard-use-case';

export interface DashboardViewModel {
  headline: string;
  openOldCount: number;
  openNewCount: number;
  shouldNotifyNow: boolean;
  folderCards: Array<{ folderId: string; done: number; total: number; percentage: number }>;
}

export class DashboardController {
  constructor(private readonly bootstrapDashboardUseCase: BootstrapDashboardUseCase) {}

  async load(input: { now: Date; alreadyNotifiedToday: boolean }): Promise<DashboardViewModel> {
    const summary = await this.bootstrapDashboardUseCase.execute(input);
    return this.toViewModel(summary);
  }

  private toViewModel(summary: DashboardSummary): DashboardViewModel {
    const totalOpen = summary.openOldCount + summary.openNewCount;

    return {
      headline: totalOpen === 0 ? 'Alles erledigt 🎉' : `Noch ${totalOpen} Aufgaben offen`,
      openOldCount: summary.openOldCount,
      openNewCount: summary.openNewCount,
      shouldNotifyNow: summary.shouldNotifyNow,
      folderCards: summary.folderProgress.map((fp) => ({
        folderId: fp.folderId,
        done: fp.done,
        total: fp.total,
        percentage: fp.total === 0 ? 100 : Math.round((fp.done / fp.total) * 100),
      })),
    };
  }
}
