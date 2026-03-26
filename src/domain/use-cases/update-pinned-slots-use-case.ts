import { PinnedSlot } from '../models/pinned-slot';
import { AppStateRepository } from '../repositories/app-state-repository';
import { PinnedSlotConfigService } from '../services/pinned-slot-config-service';

export interface UpdatePinnedSlotsResult {
  ok: boolean;
  errors: string[];
}

export class UpdatePinnedSlotsUseCase {
  constructor(
    private readonly appStateRepository: AppStateRepository,
    private readonly configService: PinnedSlotConfigService = new PinnedSlotConfigService(),
  ) {}

  async execute(slots: PinnedSlot[]): Promise<UpdatePinnedSlotsResult> {
    const validation = this.configService.validate(slots);

    if (!validation.valid) {
      return { ok: false, errors: validation.errors };
    }

    await this.appStateRepository.savePinnedSlots(slots);
    return { ok: true, errors: [] };
  }
}
