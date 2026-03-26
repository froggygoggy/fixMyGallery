CREATE TABLE IF NOT EXISTS onboarding_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER
);

CREATE TABLE IF NOT EXISTS selected_folders (
  folder_bucket_id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS reminder_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  enabled INTEGER NOT NULL DEFAULT 1,
  mode TEXT NOT NULL DEFAULT 'only_when_open_tasks',
  time_of_day TEXT NOT NULL DEFAULT '19:00'
);

CREATE TABLE IF NOT EXISTS new_photo_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  window_days INTEGER NOT NULL DEFAULT 30
);
