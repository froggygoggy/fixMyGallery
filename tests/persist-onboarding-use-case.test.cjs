const test = require('node:test');
const assert = require('node:assert/strict');
const { PersistOnboardingUseCase } = require('../dist/domain/use-cases/persist-onboarding-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('PersistOnboardingUseCase saves valid onboarding config to repository', async () => {
  const repo = new InMemoryAppStateRepository();
  const useCase = new PersistOnboardingUseCase(repo);

  const result = await useCase.execute({
    selectedFolderBucketIds: ['cam'],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '18:00' },
  });

  assert.equal(result.ok, true);

  const stored = await repo.loadOnboardingConfig();
  assert.equal(stored.onboardingState.completed, true);
  assert.deepEqual(stored.onboardingState.selectedFolderBucketIds, ['cam']);
});
