import { ReminderSettings } from '../models/reminder-settings';

export interface ReminderDecisionInput {
  settings: ReminderSettings;
  openItemsCount: number;
  now: Date;
  alreadyNotifiedToday: boolean;
}

export interface ReminderDecision {
  shouldNotify: boolean;
  reason:
    | 'disabled'
    | 'no_open_tasks'
    | 'already_notified'
    | 'outside_time_window'
    | 'notify';
}

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
}
