export interface FolderUsage {
  folderBucketId: string;
  useCount: number;
  lastUsedAt?: number;
}

export interface FolderRecommendationInput {
  availableFolderBucketIds: string[];
  usage: FolderUsage[];
  limit?: number;
}

export class FolderRecommendationService {
  recommend(input: FolderRecommendationInput): string[] {
    const limit = input.limit ?? 8;
    const allowed = new Set(input.availableFolderBucketIds);

    return input.usage
      .filter((item) => allowed.has(item.folderBucketId))
      .sort((a, b) => {
        const recencyA = a.lastUsedAt ?? 0;
        const recencyB = b.lastUsedAt ?? 0;

        if (recencyA !== recencyB) {
          return recencyB - recencyA;
        }

        if (a.useCount !== b.useCount) {
          return b.useCount - a.useCount;
        }

        return a.folderBucketId.localeCompare(b.folderBucketId);
      })
      .slice(0, limit)
      .map((item) => item.folderBucketId);
  }
}
