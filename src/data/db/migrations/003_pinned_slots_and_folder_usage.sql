CREATE TABLE IF NOT EXISTS folder_usage_stats (
  folder_bucket_id TEXT PRIMARY KEY,
  use_count INTEGER NOT NULL DEFAULT 0,
  last_used_at INTEGER
);

CREATE TABLE IF NOT EXISTS pinned_slots (
  position TEXT PRIMARY KEY,
  action_type TEXT NOT NULL,
  folder_bucket_id TEXT,
  enabled INTEGER NOT NULL DEFAULT 1
);

INSERT OR IGNORE INTO pinned_slots (position, action_type, folder_bucket_id, enabled)
VALUES
  ('left_center', 'delete', NULL, 1),
  ('right_center', 'open_folder_drawer', NULL, 1);
