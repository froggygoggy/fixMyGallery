import { PinnedSlot } from '../models/pinned-slot';
import { SortAction } from '../models/sort-action';
import { PinnedSlotService, Point } from './pinned-slot-service';

export interface SortActionPlannerInput {
  selectedMediaIds: string[];
  swipeEndPoint?: Point;
  pinnedSlots: PinnedSlot[];
  slotPositions: Record<PinnedSlot['position'], Point>;
  hitRadius: number;
  deleteFallbackDirection: 'left' | 'right';
  swipeDirection?: 'left' | 'right';
}

export class SortActionPlannerService {
  constructor(private readonly pinnedSlotService: PinnedSlotService = new PinnedSlotService()) {}

  plan(input: SortActionPlannerInput): SortAction {
    if (input.selectedMediaIds.length === 0) {
      return { type: 'noop', mediaStoreIds: [] };
    }

    if (input.swipeEndPoint) {
      const slotHit = this.pinnedSlotService.resolveTarget({
        end: input.swipeEndPoint,
        slots: input.pinnedSlots,
        hitRadius: input.hitRadius,
        slotPositions: input.slotPositions,
      });

      if (slotHit.matched && slotHit.slot) {
        if (slotHit.slot.actionType === 'delete') {
          return { type: 'delete', mediaStoreIds: input.selectedMediaIds };
        }

        if (slotHit.slot.actionType === 'open_folder_drawer') {
          return { type: 'open_folder_drawer', mediaStoreIds: input.selectedMediaIds };
        }

        return {
          type: 'move_to_folder',
          mediaStoreIds: input.selectedMediaIds,
          folderBucketId: slotHit.slot.folderBucketId,
        };
      }
    }

    if (input.swipeDirection === input.deleteFallbackDirection) {
      return { type: 'delete', mediaStoreIds: input.selectedMediaIds };
    }

    return { type: 'open_folder_drawer', mediaStoreIds: input.selectedMediaIds };
  }
}
