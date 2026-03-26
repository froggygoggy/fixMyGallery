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


test('ReminderDecisionService respects weekly frequency and weekday', () => {
  const service = new ReminderDecisionService();

  const blocked = service.shouldNotify({
    settings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '09:30', frequency: 'weekly', weekday: 5 },
    openItemsCount: 3,
    now: new Date('2026-03-26T10:00:00Z'),
    alreadyNotifiedToday: false,
  });

  assert.equal(blocked.shouldNotify, false);
  assert.equal(blocked.reason, 'outside_frequency_window');

  const allowed = service.shouldNotify({
    settings: { enabled: true, mode: 'only_when_open_tasks', timeOfDay: '09:30', frequency: 'weekly', weekday: 4 },
    openItemsCount: 3,
    now: new Date('2026-03-26T10:00:00Z'),
    alreadyNotifiedToday: false,
    lastNotifiedAt: new Date('2026-03-18T10:00:00Z'),
  });

  assert.equal(allowed.shouldNotify, true);
  assert.equal(allowed.reason, 'notify');
});
