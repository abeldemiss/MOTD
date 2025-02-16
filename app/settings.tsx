import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, List, Switch, Button, Divider, useTheme, MD3Theme, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../src/hooks/useSettings';
import { CountryPicker } from '../src/components/settings/CountryPicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cacheStorage } from '../src/services/cache/storage';
import { useNotifications } from '../src/hooks/useNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { settings, updateSettings, clearSettings } = useSettings();
  const { enabled: notificationsEnabled, loading: notificationsLoading, enableNotifications, disableNotifications } = useNotifications();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [clearingCache, setClearingCache] = useState(false);

  const handleClearCache = async () => {
    try {
      setClearingCache(true);
      // Get all keys
      const allKeys = await AsyncStorage.getAllKeys();
      // Filter only our app's cache keys (they start with 'motd:')
      const cacheKeys = allKeys.filter(key => key.startsWith('motd:'));
      // Remove all cache keys
      await AsyncStorage.multiRemove(cacheKeys);
      
      setSnackbarMessage('Cache cleared successfully');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      setSnackbarMessage('Failed to clear cache');
      setSnackbarVisible(true);
    } finally {
      setClearingCache(false);
    }
  };

  const handleNotificationToggle = async () => {
    try {
      if (notificationsEnabled) {
        await disableNotifications();
      } else {
        await enableNotifications();
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDarkModeToggle = async (darkMode: boolean) => {
    console.log('Toggling dark mode:', { current: settings.darkMode, new: darkMode });
    try {
      await updateSettings({ darkMode });
      console.log('Dark mode updated successfully');
    } catch (error) {
      console.error('Failed to update dark mode:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          
          <CountryPicker
            value={settings.country}
            onChange={(country) => updateSettings({ country })}
          />

          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={settings.darkMode}
                onValueChange={handleDarkModeToggle}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Daily Movie Notifications"
            description="Get notified about the movie of the day"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                disabled={notificationsLoading}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Data & Storage</List.Subheader>
          
          <List.Item
            title="Clear Cache"
            description="Free up storage space"
            left={props => <List.Icon {...props} icon="cached" />}
            onPress={handleClearCache}
            disabled={clearingCache}
          />

          <List.Item
            title="Reset Preferences"
            description="Restore default settings"
            left={props => <List.Icon {...props} icon="refresh" />}
            onPress={clearSettings}
          />
        </List.Section>

        <View style={styles.about}>
          <Text variant="titleMedium">About</Text>
          <Text variant="bodyMedium" style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  about: {
    padding: 16,
    alignItems: 'center',
  },
  version: {
    marginTop: 8,
    color: theme.colors.onSurfaceVariant,
  },
}); 