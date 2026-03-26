import { UndoOperationType } from './undo-operation';

export interface UndoHistoryEntry {
  id: string;
  operationType: UndoOperationType;
  mediaStoreIds: string[];
  sourceFolderBucketId?: string;
  createdAt: number;
}
