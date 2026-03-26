import { CreatedAlbum } from '../models/created-album';
import { AppStateRepository } from '../repositories/app-state-repository';

export interface CreateTargetAlbumResult {
  ok: boolean;
  album?: CreatedAlbum;
  errors: string[];
}

const INVALID_CHARS = /[\\/:*?"<>|]/;

export class CreateTargetAlbumUseCase {
  constructor(private readonly appStateRepository: AppStateRepository) {}

  async execute(name: string, now: Date = new Date()): Promise<CreateTargetAlbumResult> {
    const trimmed = name.trim();

    if (!trimmed) {
      return { ok: false, errors: ['Album name must not be empty.'] };
    }

    if (trimmed.length > 60) {
      return { ok: false, errors: ['Album name must be 60 characters or fewer.'] };
    }

    if (INVALID_CHARS.test(trimmed)) {
      return { ok: false, errors: ['Album name contains invalid characters.'] };
    }

    const existing = await this.appStateRepository.loadCreatedAlbums();
    const duplicate = existing.find((album) => album.name.toLowerCase() === trimmed.toLowerCase());

    if (duplicate) {
      return { ok: true, album: duplicate, errors: [] };
    }

    const album: CreatedAlbum = {
      id: `${trimmed.toLowerCase().replace(/\s+/g, '-')}-${now.getTime()}`,
      name: trimmed,
      createdAt: now.getTime(),
    };

    await this.appStateRepository.saveCreatedAlbums([...existing, album]);

    return {
      ok: true,
      album,
      errors: [],
    };
  }
}
