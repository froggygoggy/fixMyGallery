import { SwipeDeleteDirection } from '../models/sorting-session-preferences';

export type SwipeIntent = 'delete' | 'open_folder_drawer';

export class SwipeIntentService {
  resolveIntent(direction: 'left' | 'right', deleteDirection: SwipeDeleteDirection): SwipeIntent {
    return direction === deleteDirection ? 'delete' : 'open_folder_drawer';
  }
}
