import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import HomeScreen from '../screens/HomeScreen';
import ActivePickupScreen from '../screens/ActivePickupScreen';
import PickupConfirmationScreen from '../screens/PickupConfirmationScreen';
import DeliveryNavigationScreen from '../screens/DeliveryNavigationScreen';
import DeliveryCompletionScreen from '../screens/DeliveryCompletionScreen';
import ProfileScreen from '../screens/ProfileScreen';

import RestaurantDashboardScreen from '../screens/restaurant/RestaurantDashboardScreen';
import NewDonationScreen from '../screens/restaurant/NewDonationScreen';
import RestaurantProfileScreen from '../screens/restaurant/RestaurantProfileScreen';
import DonationHistoryScreen from '../screens/restaurant/DonationHistoryScreen';
import RestaurantNotificationsScreen from '../screens/restaurant/RestaurantNotificationsScreen';

import ShelterDashboardScreen from '../screens/shelter/ShelterDashboardScreen';

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

function VolunteerTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FC8019',
        tabBarInactiveTintColor: '#BBBBBB',
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          borderTopColor: '#EEEEEE',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Deliveries' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function RestaurantStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboardScreen} />
      <Stack.Screen name="NewDonation" component={NewDonationScreen} />
      <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
      <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
      <Stack.Screen name="RestaurantNotifications" component={RestaurantNotificationsScreen} />
    </Stack.Navigator>
  );
}

function ShelterStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShelterDashboard" component={ShelterDashboardScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RoleSelection">
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="VolunteerTab" component={VolunteerTab} />
      <Stack.Screen name="RestaurantStack" component={RestaurantStack} />
      <Stack.Screen name="ShelterStack" component={ShelterStack} />
    </Stack.Navigator>
  );
}
