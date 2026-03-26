import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SortingSessionScreen } from './src/screens/SortingSessionScreen';
import { bootstrapOnboardingAndSession } from './src/state/session-bootstrap';

type Step = 'onboarding' | 'sorting';

export default function App(): React.JSX.Element {
  const [step, setStep] = useState<Step>('onboarding');
  const [queueMediaIds, setQueueMediaIds] = useState<string[]>([]);
  const [status, setStatus] = useState('Bereit für Onboarding');

  const availableFolders = useMemo(
    () => [
      { bucketId: 'camera', name: 'Camera' },
      { bucketId: 'screenshots', name: 'Screenshots' },
    ],
    [],
  );

  async function handleOnboardingComplete(input: {
    selectedFolderBucketIds: string[];
    processType: 'day_month' | 'chronological_asc' | 'chronological_desc';
  }): Promise<void> {
    const bootstrap = await bootstrapOnboardingAndSession(input.selectedFolderBucketIds, input.processType);
    setQueueMediaIds(bootstrap.queueMediaIds);
    setStatus(`Session gestartet: ${bootstrap.queueMediaIds.length} Elemente in der Queue.`);
    setStep('sorting');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Fix my Gallery (React Native Bootstrap)</Text>
        <Text style={styles.status}>{status}</Text>

        {step === 'onboarding' ? (
          <OnboardingScreen availableFolders={availableFolders} onComplete={handleOnboardingComplete} />
        ) : (
          <SortingSessionScreen
            queueMediaIds={queueMediaIds}
            onMove={() => setStatus('Move-Aktion geplant (UI ready).')}
            onCopy={() => setStatus('Copy-Aktion geplant (UI ready).')}
            onDelete={() => setStatus('Delete-Aktion geplant (UI ready).')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1 },
  header: { fontSize: 18, fontWeight: '700', paddingHorizontal: 24, paddingTop: 16 },
  status: { fontSize: 13, color: '#334155', paddingHorizontal: 24, paddingBottom: 8 },
});
