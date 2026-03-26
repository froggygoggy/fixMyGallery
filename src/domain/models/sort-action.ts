export type SortActionType = 'delete' | 'move_to_folder' | 'copy_to_folder' | 'open_folder_drawer' | 'noop';

export interface SortAction {
  type: SortActionType;
  folderBucketId?: string;
  mediaStoreIds: string[];
}
