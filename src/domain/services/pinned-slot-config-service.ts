import { PinnedSlot } from '../models/pinned-slot';

export interface PinnedSlotValidationResult {
  valid: boolean;
  errors: string[];
}

export class PinnedSlotConfigService {
  validate(slots: PinnedSlot[]): PinnedSlotValidationResult {
    const errors: string[] = [];
    const positionSet = new Set<string>();

    let deleteCount = 0;
    let drawerCount = 0;

    for (const slot of slots) {
      if (positionSet.has(slot.position)) {
        errors.push(`Duplicate slot position: ${slot.position}`);
      }
      positionSet.add(slot.position);

      if (slot.actionType === 'delete') {
        deleteCount += 1;
      }

      if (slot.actionType === 'open_folder_drawer') {
        drawerCount += 1;
      }

      if (slot.actionType === 'move_to_folder' && !slot.folderBucketId) {
        errors.push(`Move slot at ${slot.position} requires a folderBucketId.`);
      }
    }

    if (deleteCount > 1) {
      errors.push('Only one delete slot is allowed.');
    }

    if (drawerCount > 1) {
      errors.push('Only one folder drawer slot is allowed.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
