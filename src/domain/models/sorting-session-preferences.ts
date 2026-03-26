export type SortViewMode = 'single' | 'grid';
export type SwipeDeleteDirection = 'left' | 'right';

export interface SortingSessionPreferences {
  viewMode: SortViewMode;
  swipeDeleteDirection: SwipeDeleteDirection;
  gridSize: number;
}
