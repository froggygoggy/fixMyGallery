export type ReminderMode = 'only_when_open_tasks';
export type ReminderFrequency = 'daily' | 'weekly';

export interface ReminderSettings {
  enabled: boolean;
  mode: ReminderMode;
  timeOfDay: string;
  frequency?: ReminderFrequency;
  weekday?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}
