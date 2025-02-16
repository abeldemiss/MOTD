import React, { useEffect, useState } from 'react';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { useSettings } from '../src/hooks/useSettings';
import { useColorScheme, StyleSheet } from 'react-native';

export default function RootLayout() {
  const { settings, loading } = useSettings();
  const colorScheme = useColorScheme();
  const [key, setKey] = useState(0); // Add a key to force re-render
  
  // Only use dark mode if explicitly set in settings
  const isDarkMode = settings.darkMode;
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    console.log('Theme changed:', { isDarkMode, darkMode: settings.darkMode, theme: theme.dark });
    // Force re-render when theme changes
    setKey(prev => prev + 1);
  }, [isDarkMode, settings.darkMode]);

  if (loading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme} key={key}>
          <Tabs
            screenOptions={{
              tabBarStyle: {
                backgroundColor: theme.colors.background,
                borderTopColor: theme.colors.outline,
                borderTopWidth: StyleSheet.hairlineWidth,
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
              headerStyle: {
                backgroundColor: theme.colors.background,
                borderBottomColor: theme.colors.outline,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
              headerTintColor: theme.colors.onBackground,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Today',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="movie" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cog" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="archived/index"
              options={{
                title: 'Archive',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="archive" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="movie/[id]"
              options={{
                href: null,
                title: 'Movie Details'
              }}
            />
          </Tabs>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 