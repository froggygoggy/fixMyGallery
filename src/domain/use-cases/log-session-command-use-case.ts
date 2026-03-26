import { SessionCommandLogEntry } from '../models/session-command-log-entry';
import { SessionState } from '../models/session-state';
import { AppStateRepository } from '../repositories/app-state-repository';

export interface LogSessionCommandInput {
  previousState: SessionState;
  nextState: SessionState;
  actionType: string;
  selectedMediaIds: string[];
  timestampMs: number;
  processedCountDelta: number;
  processedMinutesDelta: number;
}

export class LogSessionCommandUseCase {
  constructor(private readonly appStateRepository: AppStateRepository) {}

  async execute(input: LogSessionCommandInput): Promise<SessionCommandLogEntry> {
    const entry: SessionCommandLogEntry = {
      id: `${input.timestampMs}-${input.actionType}-${input.selectedMediaIds.join(',')}`,
      actionType: input.actionType,
      mediaStoreIds: [...input.selectedMediaIds],
      timestampMs: input.timestampMs,
      statusBefore: input.previousState.status,
      statusAfter: input.nextState.status,
      processedCountDelta: input.processedCountDelta,
      processedMinutesDelta: input.processedMinutesDelta,
    };

    await this.appStateRepository.appendSessionCommandLog(entry);
    return entry;
  }
}
