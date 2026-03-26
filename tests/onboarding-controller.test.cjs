const test = require('node:test');
const assert = require('node:assert/strict');
const { OnboardingController } = require('../dist/app/adapters/onboarding-controller');
const { PersistOnboardingUseCase } = require('../dist/domain/use-cases/persist-onboarding-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('OnboardingController submit returns success and persists config', async () => {
  const repo = new InMemoryAppStateRepository();
  const controller = new OnboardingController(new PersistOnboardingUseCase(repo));

  const result = await controller.submit({
    selectedFolderBucketIds: ['cam'],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '18:00' },
  });

  assert.equal(result.success, true);
  const saved = await repo.loadOnboardingConfig();
  assert.equal(saved.onboardingState.completed, true);
});
