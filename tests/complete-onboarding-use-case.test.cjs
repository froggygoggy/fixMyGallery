const test = require('node:test');
const assert = require('node:assert/strict');
const { CompleteOnboardingUseCase } = require('../dist/domain/use-cases/complete-onboarding-use-case');

test('CompleteOnboardingUseCase returns normalized onboarding config', () => {
  const useCase = new CompleteOnboardingUseCase();
  const completedAt = Date.UTC(2026, 2, 26);

  const result = useCase.execute({
    selectedFolderBucketIds: ['cam', 'wa'],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 100, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '18:30' },
    completedAtMs: completedAt,
  });

  assert.equal(result.ok, true);
  assert.equal(result.config.onboardingState.completed, true);
  assert.equal(result.config.newPhotosSettings.windowDays, 30);
  assert.equal(result.config.onboardingState.completedAt, completedAt);
});

test('CompleteOnboardingUseCase rejects invalid setup', () => {
  const useCase = new CompleteOnboardingUseCase();

  const result = useCase.execute({
    selectedFolderBucketIds: [],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 0, period: 'week' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 0, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '99:99' },
    newPhotosSettings: { windowDays: 0 },
  });

  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 5);
});
