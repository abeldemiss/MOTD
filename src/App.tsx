import React from 'react';
import { ExpoRoot } from 'expo-router';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={MD3LightTheme}>
          <ExpoRoot context={require.context('../app')} />
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 