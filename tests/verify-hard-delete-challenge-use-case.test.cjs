const test = require('node:test');
const assert = require('node:assert/strict');
const { VerifyHardDeleteChallengeUseCase } = require('../dist/domain/use-cases/verify-hard-delete-challenge-use-case');

test('VerifyHardDeleteChallengeUseCase validates typed challenge string', () => {
  const useCase = new VerifyHardDeleteChallengeUseCase();

  const success = useCase.execute(120, 'DELETE 120');
  assert.equal(success.valid, true);
  assert.equal(success.challenge.challengeText, 'DELETE 120');

  const fail = useCase.execute(120, 'delete all');
  assert.equal(fail.valid, false);
});
