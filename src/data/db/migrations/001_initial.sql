CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  media_store_bucket_id TEXT NOT NULL,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  selected INTEGER NOT NULL DEFAULT 0,
  progress_state TEXT NOT NULL DEFAULT 'not_started'
);

CREATE TABLE IF NOT EXISTS media_items (
  media_store_id TEXT PRIMARY KEY,
  uri TEXT NOT NULL,
  folder_bucket_id TEXT NOT NULL,
  date_taken INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER
);

CREATE TABLE IF NOT EXISTS review_status (
  media_store_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at INTEGER,
  source_folder_id TEXT,
  target_folder_id TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS plans (
  mode TEXT PRIMARY KEY,
  quota_type TEXT NOT NULL,
  quota_value INTEGER NOT NULL,
  period TEXT NOT NULL
);
