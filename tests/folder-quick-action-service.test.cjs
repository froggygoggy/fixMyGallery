const test = require('node:test');
const assert = require('node:assert/strict');
const { FolderQuickActionService } = require('../dist/domain/services/folder-quick-action-service');

test('FolderQuickActionService suggests move slots for most relevant folders', () => {
  const service = new FolderQuickActionService();
  const suggestions = service.suggest(
    [
      { folderBucketId: 'family', useCount: 30, lastUsedAt: 1000 },
      { folderBucketId: 'work', useCount: 10, lastUsedAt: 2000 },
    ],
    [{ position: 'left_center', actionType: 'delete', enabled: true }],
  );

  assert.equal(suggestions.length >= 1, true);
  assert.equal(suggestions[0].actionType, 'move_to_folder');
});

test('FolderQuickActionService avoids folders already pinned as move targets', () => {
  const service = new FolderQuickActionService();
  const suggestions = service.suggest(
    [
      { folderBucketId: 'family', useCount: 30, lastUsedAt: 1000 },
      { folderBucketId: 'work', useCount: 10, lastUsedAt: 900 },
    ],
    [
      { position: 'left_center', actionType: 'delete', enabled: true },
      { position: 'top_left', actionType: 'move_to_folder', folderBucketId: 'family', enabled: true },
    ],
  );

  assert.equal(suggestions.some((slot) => slot.folderBucketId === 'family'), false);
  assert.equal(suggestions[0].folderBucketId, 'work');
});
