import { CleanupMode } from '../types/cleanup';

export interface FolderProgress {
  folderId: string;
  done: number;
  total: number;
}

export interface ProgressService {
  getOpenItemCount(mode: CleanupMode): Promise<number>;
  getFolderProgress(): Promise<FolderProgress[]>;
}
