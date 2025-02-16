import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  darkMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
};

const STORAGE_KEY = 'motd:settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && mounted) {
          const parsedSettings = JSON.parse(stored);
          console.log('Loaded settings:', parsedSettings);
          setSettings(parsedSettings);
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to load settings:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      console.log('Updating settings:', updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, [settings]);

  const clearSettings = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Settings cleared, resetting to defaults:', DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Failed to clear settings:', error);
      throw error;
    }
  }, []);

  return { settings, loading, updateSettings, clearSettings };
}; 