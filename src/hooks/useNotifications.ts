import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notifications';
import { useRouter } from 'expo-router';

export const useNotifications = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    checkNotificationStatus();
    setupListeners();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const checkNotificationStatus = async () => {
    try {
      setLoading(true);
      const { status } = await Notifications.getPermissionsAsync();
      setEnabled(status === 'granted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check notifications');
    } finally {
      setLoading(false);
    }
  };

  const setupListeners = () => {
    // Handle notification when app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Received notification:', notification);
      }
    );

    // Handle notification when user taps it
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        if (data.type === 'movie_of_the_day') {
          router.push('/');
        }
      }
    );
  };

  const enableNotifications = async () => {
    try {
      setLoading(true);
      await notificationService.registerForPushNotifications();
      await notificationService.scheduleMovieOfTheDayNotification();
      setEnabled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disableNotifications = async () => {
    try {
      setLoading(true);
      await Notifications.cancelAllScheduledNotificationsAsync();
      setEnabled(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    enabled,
    loading,
    error,
    enableNotifications,
    disableNotifications,
  };
}; 