import { ProgressState } from '../types/cleanup';

export interface Folder {
  id: string;
  mediaStoreBucketId: string;
  name: string;
  path: string;
  selected: boolean;
  progressState: ProgressState;
}
