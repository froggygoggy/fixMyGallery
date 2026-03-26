const test = require('node:test');
const assert = require('node:assert/strict');
const { OnboardingPresenter } = require('../dist/app/presenters/onboarding-presenter');
const { OnboardingController } = require('../dist/app/adapters/onboarding-controller');
const { PersistOnboardingUseCase } = require('../dist/domain/use-cases/persist-onboarding-use-case');
const { InMemoryAppStateRepository } = require('../dist/data/repositories/in-memory-app-state-repository');

test('OnboardingPresenter maps successful submit to success view state', async () => {
  const repo = new InMemoryAppStateRepository();
  const presenter = new OnboardingPresenter(new OnboardingController(new PersistOnboardingUseCase(repo)));

  const state = await presenter.submit({
    selectedFolderBucketIds: ['cam'],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '18:00' },
  });

  assert.equal(state.success, true);
  assert.equal(state.errors.length, 0);
});
