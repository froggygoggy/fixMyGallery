export class GridSelectionService {
  toggleSelection(current: string[], mediaId: string): string[] {
    const set = new Set(current);

    if (set.has(mediaId)) {
      set.delete(mediaId);
    } else {
      set.add(mediaId);
    }

    return [...set];
  }

  selectAll(current: string[], allVisibleMediaIds: string[]): string[] {
    const set = new Set(current);
    for (const id of allVisibleMediaIds) {
      set.add(id);
    }

    return [...set];
  }

  clearSelection(): string[] {
    return [];
  }
}
