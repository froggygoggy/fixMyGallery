export type SlotPosition =
  | 'left_center'
  | 'right_center'
  | 'top_left'
  | 'top_center'
  | 'bottom_left'
  | 'bottom_center';

export type SlotActionType = 'delete' | 'open_folder_drawer' | 'move_to_folder';

export interface PinnedSlot {
  position: SlotPosition;
  actionType: SlotActionType;
  folderBucketId?: string;
  enabled: boolean;
}
