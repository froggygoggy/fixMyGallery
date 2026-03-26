import { FolderProgress } from '../services/progress-service';

export interface DashboardSummary {
  openOldCount: number;
  openNewCount: number;
  shouldNotifyNow: boolean;
  folderProgress: FolderProgress[];
}
