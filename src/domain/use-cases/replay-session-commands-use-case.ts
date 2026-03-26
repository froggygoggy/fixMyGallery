import { SessionCommandLogEntry } from '../models/session-command-log-entry';
import { SessionState } from '../models/session-state';
import { AppStateRepository } from '../repositories/app-state-repository';
import { SessionStateMachineService } from '../services/session-state-machine-service';

export interface ReplaySessionCommandsResult {
  state: SessionState;
  replayedCommands: SessionCommandLogEntry[];
}

export class ReplaySessionCommandsUseCase {
  constructor(
    private readonly appStateRepository: AppStateRepository,
    private readonly sessionStateMachineService: SessionStateMachineService = new SessionStateMachineService(),
  ) {}

  async execute(initialState: SessionState): Promise<ReplaySessionCommandsResult> {
    const logs = await this.appStateRepository.loadSessionCommandLogs();

    const state = logs.reduce((currentState, command) => {
      if (command.statusAfter === 'paused') {
        return this.sessionStateMachineService.transition(currentState, { type: 'pause' });
      }

      if (command.statusAfter === 'completed') {
        return this.sessionStateMachineService.transition(currentState, { type: 'complete' });
      }

      return this.sessionStateMachineService.transition(currentState, {
        type: 'apply_action',
        processedCount: command.processedCountDelta,
        processedMinutes: command.processedMinutesDelta,
      });
    }, initialState);

    return {
      state,
      replayedCommands: logs,
    };
  }
}
