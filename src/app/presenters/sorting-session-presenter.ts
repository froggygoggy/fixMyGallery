import { BulkActionPreview } from '../../domain/models/bulk-action-preview';
import { SortingSessionPreferences } from '../../domain/models/sorting-session-preferences';

export interface SortingSessionScreenState {
  viewMode: 'single' | 'grid';
  gridSize: number;
  deleteDirection: 'left' | 'right';
  selectionCount: number;
  bulkActionPreview?: BulkActionPreview;
}

export class SortingSessionPresenter {
  toScreenState(input: {
    preferences: SortingSessionPreferences;
    selectedMediaIds: string[];
    bulkActionPreview?: BulkActionPreview;
  }): SortingSessionScreenState {
    return {
      viewMode: input.preferences.viewMode,
      gridSize: input.preferences.gridSize,
      deleteDirection: input.preferences.swipeDeleteDirection,
      selectionCount: input.selectedMediaIds.length,
      bulkActionPreview: input.bulkActionPreview,
    };
  }
}
