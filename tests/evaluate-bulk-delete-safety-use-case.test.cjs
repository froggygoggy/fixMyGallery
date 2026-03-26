const test = require('node:test');
const assert = require('node:assert/strict');
const { EvaluateBulkDeleteSafetyUseCase } = require('../dist/domain/use-cases/evaluate-bulk-delete-safety-use-case');

test('EvaluateBulkDeleteSafetyUseCase returns hard confirm for very large deletes', () => {
  const useCase = new EvaluateBulkDeleteSafetyUseCase();
  const result = useCase.execute(80);

  assert.equal(result.level, 'hard_confirm');
});
