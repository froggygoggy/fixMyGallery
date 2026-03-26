import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface OnboardingScreenProps {
  availableFolders: Array<{ bucketId: string; name: string }>;
  onComplete: (selectedFolderBucketIds: string[]) => void;
}

export function OnboardingScreen({ availableFolders, onComplete }: OnboardingScreenProps): React.JSX.Element {
  const [selected, setSelected] = useState<string[]>([]);

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

      <Pressable
        disabled={!hasSelection}
        style={[styles.primaryButton, !hasSelection && styles.primaryButtonDisabled]}
        onPress={() => onComplete(selected)}>
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
  rowSelected: { backgroundColor: '#bfdbfe' },
  rowText: { fontSize: 16, color: '#0f172a' },
  primaryButton: { marginTop: 20, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#1d4ed8' },
  primaryButtonDisabled: { backgroundColor: '#93c5fd' },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
});
