const test = require('node:test');
const assert = require('node:assert/strict');
const { FolderRecommendationService } = require('../dist/domain/services/folder-recommendation-service');

test('FolderRecommendationService prioritizes recency then frequency', () => {
  const service = new FolderRecommendationService();

  const result = service.recommend({
    availableFolderBucketIds: ['a', 'b', 'c'],
    usage: [
      { folderBucketId: 'a', useCount: 100, lastUsedAt: 1000 },
      { folderBucketId: 'b', useCount: 10, lastUsedAt: 2000 },
      { folderBucketId: 'c', useCount: 80, lastUsedAt: 2000 },
      { folderBucketId: 'x', useCount: 999, lastUsedAt: 9999 },
    ],
    limit: 3,
  });

  assert.deepEqual(result, ['c', 'b', 'a']);
});
