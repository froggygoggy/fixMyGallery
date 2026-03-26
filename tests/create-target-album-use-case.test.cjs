const test = require('node:test');
const assert = require('node:assert/strict');
const { CreateTargetAlbumUseCase } = require('../dist/domain/use-cases/create-target-album-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('CreateTargetAlbumUseCase creates and deduplicates albums', async () => {
  const repo = new InMemoryAppStateRepository();
  const useCase = new CreateTargetAlbumUseCase(repo);
  const now = new Date(Date.UTC(2026, 2, 26));

  const first = await useCase.execute('Familie', now);
  const second = await useCase.execute('familie', now);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.album.id, second.album.id);

  const albums = await repo.loadCreatedAlbums();
  assert.equal(albums.length, 1);
});
