import { SessionState } from '../models/session-state';
import { SessionStateMachineService } from '../services/session-state-machine-service';

export interface ApplySessionTimeProgressResult {
  nextState: SessionState;
  creditedMinutes: number;
}

export class ApplySessionTimeProgressUseCase {
  constructor(private readonly stateMachine: SessionStateMachineService = new SessionStateMachineService()) {}

  execute(state: SessionState, activeMilliseconds: number): ApplySessionTimeProgressResult {
    const creditedMinutes = activeMilliseconds <= 0 ? 0 : Math.max(1, Math.floor(activeMilliseconds / 60000));

    const nextState = this.stateMachine.transition(state, {
      type: 'apply_action',
      processedCount: 0,
      processedMinutes: creditedMinutes,
    });

    return {
      nextState,
      creditedMinutes,
    };
  }
}
