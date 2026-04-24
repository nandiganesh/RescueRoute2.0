import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermission, setupNotificationListener } from './src/services/notifications';
import { startLocationTracking } from './src/services/location';
import useStore from './src/store/useStore';

export default function App() {
  const isOnline = useStore((state) => state.isOnline);
  const volunteerId = useStore((state) => state.volunteerId);

  useEffect(() => {
    // Setup Notifications
    requestNotificationPermission();
    const unsubscribeNotifications = setupNotificationListener();

    // Start Location Tracking if online
    let stopTracking;
    const initTracking = async () => {
      if (isOnline && volunteerId) {
        stopTracking = await startLocationTracking(volunteerId);
      }
    };
    initTracking();

    return () => {
      unsubscribeNotifications();
      if (stopTracking) stopTracking();
    };
  }, [isOnline, volunteerId]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
