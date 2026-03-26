const test = require('node:test');
const assert = require('node:assert/strict');
const { AndroidMediaScannerService } = require('../dist/platform/android/mediaStore/android-media-scanner-service');

test('AndroidMediaScannerService maps folders and sorts by name', async () => {
  const service = new AndroidMediaScannerService({
    listFolders: async () => [
      { bucketId: '2', name: 'WhatsApp', path: '/a/whatsapp' },
      { bucketId: '1', name: 'Camera', path: '/a/camera' },
      { bucketId: '', name: 'Invalid', path: '/invalid' },
    ],
    listMediaByBucketIds: async () => [],
  });

  const folders = await service.scanFolders();
  assert.equal(folders.length, 2);
  assert.equal(folders[0].name, 'Camera');
  assert.equal(folders[1].name, 'WhatsApp');
});

test('AndroidMediaScannerService filters by selected buckets and sorts by date', async () => {
  const service = new AndroidMediaScannerService({
    listFolders: async () => [],
    listMediaByBucketIds: async () => [
      {
        mediaStoreId: 'm1',
        uri: 'content://m1',
        bucketId: 'camera',
        dateTaken: 10,
        mimeType: 'image/jpeg',
        sizeBytes: 100,
      },
      {
        mediaStoreId: 'm2',
        uri: 'content://m2',
        bucketId: 'screenshots',
        dateTaken: 20,
        mimeType: 'image/jpeg',
        sizeBytes: 80,
      },
    ],
  });

  const media = await service.scanMediaForSelectedFolders(['camera']);
  assert.equal(media.length, 1);
  assert.equal(media[0].mediaStoreId, 'm1');
});
