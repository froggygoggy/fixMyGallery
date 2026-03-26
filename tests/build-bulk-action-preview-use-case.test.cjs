const test = require('node:test');
const assert = require('node:assert/strict');
const { BuildBulkActionPreviewUseCase } = require('../dist/domain/use-cases/build-bulk-action-preview-use-case');

test('BuildBulkActionPreviewUseCase requires confirmation for large deletes', () => {
  const useCase = new BuildBulkActionPreviewUseCase();
  const preview = useCase.execute({ type: 'delete', mediaStoreIds: Array.from({ length: 12 }, (_, i) => `m${i}`) });

  assert.equal(preview.actionLabel, 'Löschen');
  assert.equal(preview.requiresConfirmation, true);
  assert.equal(preview.selectedCount, 12);
});
