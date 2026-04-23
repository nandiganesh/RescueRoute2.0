import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  console.log('Notification permission granted.');
}

export function setupNotificationListener() {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    Alert.alert(
      notification.request.content.title || 'New Alert!', 
      notification.request.content.body
    );
  });

  return () => subscription.remove();
}
