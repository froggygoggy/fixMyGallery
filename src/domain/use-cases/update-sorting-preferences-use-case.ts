import { SortingSessionPreferences } from '../models/sorting-session-preferences';

export interface UpdateSortingPreferencesInput {
  current: SortingSessionPreferences;
  viewMode?: 'single' | 'grid';
  swipeDeleteDirection?: 'left' | 'right';
  gridSize?: number;
}

export class UpdateSortingPreferencesUseCase {
  execute(input: UpdateSortingPreferencesInput): SortingSessionPreferences {
    const nextGridSize = input.gridSize ?? input.current.gridSize;

    return {
      viewMode: input.viewMode ?? input.current.viewMode,
      swipeDeleteDirection: input.swipeDeleteDirection ?? input.current.swipeDeleteDirection,
      gridSize: Math.max(1, Math.min(12, nextGridSize)),
    };
  }
}
