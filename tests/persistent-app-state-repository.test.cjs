const test = require('node:test');
const assert = require('node:assert/strict');
const { PersistentAppStateRepository } = require('../dist/data/repositories/persistent-app-state-repository');

class InMemoryKeyValueStore {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key) ?? null;
  }

  async set(key, value) {
    this.data.set(key, value);
  }
}

test('PersistentAppStateRepository stores and loads onboarding config', async () => {
  const repo = new PersistentAppStateRepository(new InMemoryKeyValueStore());
  const config = {
    onboardingState: { completed: true, selectedFolderBucketIds: ['cam'], completedAt: 1 },
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 10, period: 'day' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 5, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '09:00' },
    newPhotosSettings: { windowDays: 30 },
  };

  await repo.saveOnboardingConfig(config);
  const loaded = await repo.loadOnboardingConfig();

  assert.deepEqual(loaded, config);
});

test('PersistentAppStateRepository appends logs and pops undo entries', async () => {
  const repo = new PersistentAppStateRepository(new InMemoryKeyValueStore());

  await repo.appendUndoHistoryEntry({
    id: 'u1',
    operationType: 'restore_from_trash',
    mediaStoreIds: ['m1'],
    createdAt: 10,
  });
  await repo.appendSessionCommandLog({
    id: 'c1',
    actionType: 'delete',
    mediaStoreIds: ['m1'],
    timestampMs: 10,
    statusBefore: 'running',
    statusAfter: 'running',
    processedCountDelta: 1,
    processedMinutesDelta: 0,
  });

  const popped = await repo.popLastUndoHistoryEntry();
  const undo = await repo.loadUndoHistory();
  const commands = await repo.loadSessionCommandLogs();

  assert.equal(popped.id, 'u1');
  assert.equal(undo.length, 0);
  assert.equal(commands.length, 1);
});
