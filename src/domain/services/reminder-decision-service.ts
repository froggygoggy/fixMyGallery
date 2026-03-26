import { ReminderSettings } from '../models/reminder-settings';

export interface ReminderDecisionInput {
  settings: ReminderSettings;
  openItemsCount: number;
  now: Date;
  alreadyNotifiedToday: boolean;
  lastNotifiedAt?: Date;
}

export interface ReminderDecision {
  shouldNotify: boolean;
  reason:
    | 'disabled'
    | 'no_open_tasks'
    | 'already_notified'
    | 'outside_time_window'
    | 'outside_frequency_window'
    | 'notify';
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export class ReminderDecisionService {
  shouldNotify(input: ReminderDecisionInput): ReminderDecision {
    if (!input.settings.enabled) {
      return { shouldNotify: false, reason: 'disabled' };
    }

    if (input.openItemsCount <= 0) {
      return { shouldNotify: false, reason: 'no_open_tasks' };
    }

    if (input.alreadyNotifiedToday) {
      return { shouldNotify: false, reason: 'already_notified' };
    }

    if (!this.matchesFrequency(input)) {
      return { shouldNotify: false, reason: 'outside_frequency_window' };
    }

    const [hourString, minuteString] = input.settings.timeOfDay.split(':');
    const targetHour = Number(hourString);
    const targetMinute = Number(minuteString);

    if (Number.isNaN(targetHour) || Number.isNaN(targetMinute)) {
      return { shouldNotify: false, reason: 'outside_time_window' };
    }

    const nowHour = input.now.getHours();
    const nowMinute = input.now.getMinutes();
    const isTimeReached = nowHour > targetHour || (nowHour === targetHour && nowMinute >= targetMinute);

    if (!isTimeReached) {
      return { shouldNotify: false, reason: 'outside_time_window' };
    }

    return { shouldNotify: true, reason: 'notify' };
  }

  private matchesFrequency(input: ReminderDecisionInput): boolean {
    const frequency = input.settings.frequency ?? 'daily';

    if (frequency === 'weekly') {
      const targetWeekday = input.settings.weekday ?? 1;

      if (input.now.getDay() !== targetWeekday) {
        return false;
      }

      if (!input.lastNotifiedAt) {
        return true;
      }

      return input.now.getTime() - input.lastNotifiedAt.getTime() >= WEEK_MS;
    }

    return true;
  }
}
