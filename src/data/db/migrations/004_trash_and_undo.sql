CREATE TABLE IF NOT EXISTS trash_entries (
  media_store_id TEXT PRIMARY KEY,
  original_folder_bucket_id TEXT NOT NULL,
  deleted_at INTEGER NOT NULL,
  restore_by INTEGER
);

CREATE TABLE IF NOT EXISTS undo_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation_type TEXT NOT NULL,
  media_store_ids TEXT NOT NULL,
  source_folder_bucket_id TEXT,
  created_at INTEGER NOT NULL
);
