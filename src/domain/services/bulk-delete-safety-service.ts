export interface BulkDeleteSafetyResult {
  level: 'none' | 'confirm' | 'hard_confirm';
  message: string;
}

export class BulkDeleteSafetyService {
  evaluate(selectedCount: number): BulkDeleteSafetyResult {
    if (selectedCount < 10) {
      return {
        level: 'none',
        message: 'Löschen ohne zusätzliche Bestätigung möglich.',
      };
    }

    if (selectedCount < 50) {
      return {
        level: 'confirm',
        message: `${selectedCount} Elemente löschen? Diese landen im Papierkorb.`,
      };
    }

    return {
      level: 'hard_confirm',
      message: `${selectedCount} Elemente löschen: bitte explizit bestätigen.`,
    };
  }
}
