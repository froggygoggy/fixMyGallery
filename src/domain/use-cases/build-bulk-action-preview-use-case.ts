import { BulkActionPreview } from '../models/bulk-action-preview';
import { SortAction } from '../models/sort-action';

export class BuildBulkActionPreviewUseCase {
  execute(action: SortAction): BulkActionPreview {
    const selectedCount = action.mediaStoreIds.length;

    if (action.type === 'delete') {
      return {
        selectedCount,
        actionLabel: 'Löschen',
        requiresConfirmation: selectedCount >= 10,
        confirmationMessage:
          selectedCount >= 10
            ? `${selectedCount} Elemente werden gelöscht und in den Papierkorb verschoben.`
            : undefined,
      };
    }

    if (action.type === 'move_to_folder') {
      return {
        selectedCount,
        actionLabel: 'Verschieben',
        requiresConfirmation: false,
      };
    }

    if (action.type === 'copy_to_folder') {
      return {
        selectedCount,
        actionLabel: 'Kopieren',
        requiresConfirmation: false,
      };
    }

    return {
      selectedCount,
      actionLabel: 'Sortieren',
      requiresConfirmation: false,
    };
  }
}
