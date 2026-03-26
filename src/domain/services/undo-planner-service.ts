import { SortAction } from '../models/sort-action';
import { UndoOperation } from '../models/undo-operation';

export interface UndoPlannerInput {
  action: SortAction;
  sourceFolderBucketId?: string;
}

export class UndoPlannerService {
  plan(input: UndoPlannerInput): UndoOperation {
    if (input.action.type === 'delete') {
      return {
        type: 'restore_from_trash',
        mediaStoreIds: input.action.mediaStoreIds,
        sourceFolderBucketId: input.sourceFolderBucketId,
      };
    }

    if (input.action.type === 'move_to_folder') {
      return {
        type: 'move_back_to_source',
        mediaStoreIds: input.action.mediaStoreIds,
        sourceFolderBucketId: input.sourceFolderBucketId,
      };
    }

    return {
      type: 'none',
      mediaStoreIds: input.action.mediaStoreIds,
    };
  }
}
