import { PinnedSlot } from '../models/pinned-slot';
import { AppStateRepository } from '../repositories/app-state-repository';
import { FolderQuickActionService } from '../services/folder-quick-action-service';

export class SuggestPinnedSlotsUseCase {
  constructor(
    private readonly appStateRepository: AppStateRepository,
    private readonly folderQuickActionService: FolderQuickActionService = new FolderQuickActionService(),
  ) {}

  async execute(existingSlots: PinnedSlot[]): Promise<PinnedSlot[]> {
    const usage = await this.appStateRepository.loadFolderUsage();
    return this.folderQuickActionService.suggest(usage, existingSlots);
  }
}
