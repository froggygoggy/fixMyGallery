import { PinnedSlot, SlotPosition } from '../models/pinned-slot';

export interface Point {
  x: number;
  y: number;
}

export interface SwipeResolverInput {
  end: Point;
  slots: PinnedSlot[];
  hitRadius: number;
  slotPositions: Record<SlotPosition, Point>;
}

export interface SwipeResolveResult {
  matched: boolean;
  slot?: PinnedSlot;
}

export class PinnedSlotService {
  resolveTarget(input: SwipeResolverInput): SwipeResolveResult {
    const enabledSlots = input.slots.filter((slot) => slot.enabled);

    for (const slot of enabledSlots) {
      const pos = input.slotPositions[slot.position];
      const distance = Math.hypot(input.end.x - pos.x, input.end.y - pos.y);

      if (distance <= input.hitRadius) {
        return { matched: true, slot };
      }
    }

    return { matched: false };
  }
}
