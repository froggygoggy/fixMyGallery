import { DashboardController } from '../adapters/dashboard-controller';

export interface DashboardScreenState {
  headline: string;
  stats: {
    openOldCount: number;
    openNewCount: number;
  };
  folderCards: Array<{ folderId: string; done: number; total: number; percentage: number }>;
  notificationBannerVisible: boolean;
}

export class DashboardPresenter {
  constructor(private readonly controller: DashboardController) {}

  async load(now: Date, alreadyNotifiedToday: boolean): Promise<DashboardScreenState> {
    const vm = await this.controller.load({ now, alreadyNotifiedToday });

    return {
      headline: vm.headline,
      stats: {
        openOldCount: vm.openOldCount,
        openNewCount: vm.openNewCount,
      },
      folderCards: vm.folderCards,
      notificationBannerVisible: vm.shouldNotifyNow,
    };
  }
}
