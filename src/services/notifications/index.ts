import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { format } from 'date-fns';
import { cacheStorage } from '../cache/storage';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async registerForPushNotifications() {
    if (!Device.isDevice) {
      throw new Error('Push Notifications are only supported on physical devices');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission to send notifications was denied');
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId
    });
    return token;
  },

  async scheduleMovieOfTheDayNotification(retries = 3, delay = 1000) {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Today's Movie is Ready! 🎬",
            body: "Check out today's featured movie in the app!",
            data: { type: 'movie_of_the_day' },
          },
          trigger: {
            hour: 9,
            minute: 0,
            repeats: true,
          },
        });
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Failed to schedule notification');
        if (i < retries - 1) {
          await wait(delay);
        }
      }
    }

    throw lastError || new Error('Failed to schedule notification after retries');
  },

  async sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification from Movie of the Day',
      },
      trigger: null, // Send immediately
    });
  },
}; 