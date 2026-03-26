import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SortingSessionScreenProps {
  queueMediaIds: string[];
  onMove: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export function SortingSessionScreen({ queueMediaIds, onMove, onCopy, onDelete }: SortingSessionScreenProps): React.JSX.Element {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const visibleIds = useMemo(() => queueMediaIds.slice(0, 12), [queueMediaIds]);

  function toggleSelection(mediaId: string): void {
    setSelectedIds((prev) => (prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sortier-Session</Text>
      <Text style={styles.subtitle}>Grid + Einzelbild Auswahl, danach move/copy/delete ausführen.</Text>

      <View style={styles.grid}>
        {visibleIds.map((mediaId) => {
          const selected = selectedIds.includes(mediaId);
          return (
            <Pressable
              key={mediaId}
              onPress={() => toggleSelection(mediaId)}
              style={[styles.tile, selected && styles.tileSelected]}>
              <Text style={styles.tileText}>{mediaId}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, styles.move]} onPress={onMove}>
          <Text style={styles.actionLabel}>Move</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.copy]} onPress={onCopy}>
          <Text style={styles.actionLabel}>Copy</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.delete]} onPress={onDelete}>
          <Text style={styles.actionLabel}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#475569', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tile: { width: '31%', aspectRatio: 1, borderRadius: 8, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  tileSelected: { backgroundColor: '#c7d2fe' },
  tileText: { fontSize: 12, color: '#0f172a' },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  actionLabel: { color: '#fff', fontWeight: '700' },
  move: { backgroundColor: '#0ea5e9' },
  copy: { backgroundColor: '#22c55e' },
  delete: { backgroundColor: '#ef4444' },
});
