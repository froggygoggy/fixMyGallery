import { SessionController, SessionActionRequest } from '../adapters/session-controller';
import { de } from '../i18n/de';

export interface SessionScreenState {
  status: string;
  dashboardHeadline: string;
  toastMessage: string;
  undoHistoryCount: number;
  trashCount: number;
}

export class SessionPresenter {
  constructor(private readonly controller: SessionController) {}

  async applyAction(request: SessionActionRequest): Promise<SessionScreenState> {
    const vm = await this.controller.applyAction(request);

    return {
      status: vm.nextState.status,
      dashboardHeadline: vm.dashboardHeadline,
      toastMessage: vm.trashCount > 0 ? de.session.movedToTrash(vm.trashCount) : de.session.actionApplied,
      undoHistoryCount: vm.undoHistoryCount,
      trashCount: vm.trashCount,
    };
  }
}
