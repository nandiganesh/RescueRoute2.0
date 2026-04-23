import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ActivePickupScreen from '../screens/ActivePickupScreen';
import PickupConfirmationScreen from '../screens/PickupConfirmationScreen';
import DeliveryNavigationScreen from '../screens/DeliveryNavigationScreen';
import DeliveryCompletionScreen from '../screens/DeliveryCompletionScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMap" component={HomeScreen} />
      <Stack.Screen name="ActivePickup" component={ActivePickupScreen} />
      <Stack.Screen name="PickupConfirmation" component={PickupConfirmationScreen} />
      <Stack.Screen name="DeliveryNavigation" component={DeliveryNavigationScreen} />
      <Stack.Screen name="DeliveryCompletion" component={DeliveryCompletionScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
