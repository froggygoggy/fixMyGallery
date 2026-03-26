export interface FolderRetentionRule {
  folderBucketId: string;
  minAgeDays: number;
  enabled: boolean;
}

export interface FolderRetentionTask {
  folderBucketId: string;
  minAgeDays: number;
  candidateMediaStoreIds: string[];
}
