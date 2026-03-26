const test = require('node:test');
const assert = require('node:assert/strict');
const { ReminderDecisionService } = require('../dist/domain/services/reminder-decision-service');

test('ReminderDecisionService notifies only when conditions are met', () => {
  const service = new ReminderDecisionService();

  const shouldNotify = service.shouldNotify({
    settings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '09:30' },
    openItemsCount: 3,
    now: new Date('2026-03-25T10:00:00Z'),
    alreadyNotifiedToday: false,
  });

  assert.equal(shouldNotify.shouldNotify, true);
  assert.equal(shouldNotify.reason, 'notify');

  const noOpenTasks = service.shouldNotify({
    settings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '09:30' },
    openItemsCount: 0,
    now: new Date('2026-03-25T10:00:00Z'),
    alreadyNotifiedToday: false,
  });

  assert.equal(noOpenTasks.shouldNotify, false);
  assert.equal(noOpenTasks.reason, 'no_open_tasks');
});
