import * as Location from 'expo-location';
import { updateLocation } from './api';
import useStore from '../store/useStore';

export const startLocationTracking = async (volunteerId) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return null;
  }

  // Update location every 10 seconds
  const locationSub = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 10,
    },
    (location) => {
      const { latitude, longitude } = location.coords;
      useStore.getState().setCurrentLocation({ latitude, longitude });
      updateLocation(volunteerId, latitude, longitude);
    }
  );

  return () => locationSub.remove();
};
