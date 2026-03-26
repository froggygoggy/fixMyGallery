import { PinnedSlot, SlotPosition } from '../models/pinned-slot';
import { FolderUsage } from './folder-recommendation-service';

const SUGGESTIBLE_POSITIONS: SlotPosition[] = ['top_left', 'top_center', 'bottom_left', 'bottom_center'];

export class FolderQuickActionService {
  suggest(usage: FolderUsage[], existingSlots: PinnedSlot[]): PinnedSlot[] {
    const usedPositions = new Set(existingSlots.map((slot) => slot.position));
    const availablePositions = SUGGESTIBLE_POSITIONS.filter((pos) => !usedPositions.has(pos));

    const alreadyPinnedFolders = new Set(
      existingSlots.filter((slot) => slot.actionType === 'move_to_folder').map((slot) => slot.folderBucketId),
    );

    const topFolders = [...usage]
      .filter((folder) => !alreadyPinnedFolders.has(folder.folderBucketId))
      .sort((a, b) => {
        const aRecent = a.lastUsedAt ?? 0;
        const bRecent = b.lastUsedAt ?? 0;
        const recencyScoreA = aRecent > 0 ? 1 : 0;
        const recencyScoreB = bRecent > 0 ? 1 : 0;

        if (recencyScoreA !== recencyScoreB) {
          return recencyScoreB - recencyScoreA;
        }

        if (aRecent !== bRecent) {
          return bRecent - aRecent;
        }

        if (a.useCount !== b.useCount) {
          return b.useCount - a.useCount;
        }

        return a.folderBucketId.localeCompare(b.folderBucketId);
      })
      .slice(0, availablePositions.length);

    return topFolders.map((folder, index) => ({
      position: availablePositions[index],
      actionType: 'move_to_folder' as const,
      folderBucketId: folder.folderBucketId,
      enabled: true,
    }));
  }
}
