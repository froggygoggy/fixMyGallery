export type UndoOperationType = 'restore_from_trash' | 'move_back_to_source' | 'none';

export interface UndoOperation {
  type: UndoOperationType;
  mediaStoreIds: string[];
  sourceFolderBucketId?: string;
}
