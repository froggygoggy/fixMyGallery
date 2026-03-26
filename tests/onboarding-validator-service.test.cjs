const test = require('node:test');
const assert = require('node:assert/strict');
const { OnboardingValidatorService } = require('../dist/domain/services/onboarding-validator-service');

test('OnboardingValidatorService validates happy path', () => {
  const service = new OnboardingValidatorService();
  const result = service.validate({
    selectedFolderBucketIds: ['cam'],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 50, period: 'day' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 10, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '19:00' },
    newPhotosSettings: { windowDays: 30 },
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('OnboardingValidatorService returns errors for invalid input', () => {
  const service = new OnboardingValidatorService();
  const result = service.validate({
    selectedFolderBucketIds: [],
    oldCleanupPlan: { mode: 'old', quotaType: 'count', quotaValue: 0, period: 'day' },
    newCleanupPlan: { mode: 'new', quotaType: 'time', quotaValue: 0, period: 'day' },
    reminderSettings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '99:99' },
    newPhotosSettings: { windowDays: 0 },
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 5);
});
