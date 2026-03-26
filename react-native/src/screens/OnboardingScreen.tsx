import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface OnboardingScreenProps {
  availableFolders: Array<{ bucketId: string; name: string }>;
  onComplete: (input: {
    selectedFolderBucketIds: string[];
    processType: 'day_month' | 'chronological_asc' | 'chronological_desc';
  }) => void;
}

export function OnboardingScreen({ availableFolders, onComplete }: OnboardingScreenProps): React.JSX.Element {
  const [selected, setSelected] = useState<string[]>([]);
  const [processType, setProcessType] = useState<'day_month' | 'chronological_asc' | 'chronological_desc'>('chronological_asc');

  const hasSelection = useMemo(() => selected.length > 0, [selected]);

  function toggleFolder(bucketId: string): void {
    setSelected((prev) =>
      prev.includes(bucketId) ? prev.filter((item) => item !== bucketId) : [...prev, bucketId],
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Text style={styles.subtitle}>Wähle Ordner für deinen Cleanup-Plan aus.</Text>

      {availableFolders.map((folder) => {
        const selectedState = selected.includes(folder.bucketId);
        return (
          <Pressable
            key={folder.bucketId}
            style={[styles.row, selectedState && styles.rowSelected]}
            onPress={() => toggleFolder(folder.bucketId)}>
            <Text style={styles.rowText}>{folder.name}</Text>
            <Text>{selectedState ? '✅' : '⬜️'}</Text>
          </Pressable>
        );
      })}

      <Text style={styles.subtitle}>Aufräumprozess</Text>
      <View style={styles.processRow}>
        <Pressable style={[styles.processChip, processType === 'day_month' && styles.rowSelected]} onPress={() => setProcessType('day_month')}>
          <Text>Nach Tag</Text>
        </Pressable>
        <Pressable style={[styles.processChip, processType === 'chronological_asc' && styles.rowSelected]} onPress={() => setProcessType('chronological_asc')}>
          <Text>Chronologisch ↑</Text>
        </Pressable>
        <Pressable style={[styles.processChip, processType === 'chronological_desc' && styles.rowSelected]} onPress={() => setProcessType('chronological_desc')}>
          <Text>Chronologisch ↓</Text>
        </Pressable>
      </View>

      <Pressable
        disabled={!hasSelection}
        style={[styles.primaryButton, !hasSelection && styles.primaryButtonDisabled]}
        onPress={() => onComplete({ selectedFolderBucketIds: selected, processType })}>
        <Text style={styles.primaryButtonText}>Onboarding abschließen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#334155' },
  row: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  processRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  processChip: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#e2e8f0' },
  rowSelected: { backgroundColor: '#bfdbfe' },
  rowText: { fontSize: 16, color: '#0f172a' },
  primaryButton: { marginTop: 20, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#1d4ed8' },
  primaryButtonDisabled: { backgroundColor: '#93c5fd' },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
});
