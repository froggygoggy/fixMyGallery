CREATE TABLE IF NOT EXISTS session_command_logs (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL,
  media_store_ids_json TEXT NOT NULL,
  timestamp_ms INTEGER NOT NULL,
  status_before TEXT NOT NULL,
  status_after TEXT NOT NULL,
  processed_count_delta INTEGER NOT NULL,
  processed_minutes_delta INTEGER NOT NULL
);
