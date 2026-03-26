import { BulkDeleteSafetyResult, BulkDeleteSafetyService } from '../services/bulk-delete-safety-service';

export class EvaluateBulkDeleteSafetyUseCase {
  constructor(private readonly service: BulkDeleteSafetyService = new BulkDeleteSafetyService()) {}

  execute(selectedCount: number): BulkDeleteSafetyResult {
    return this.service.evaluate(selectedCount);
  }
}
