import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/useStore';
import api from '../services/api';
import MapComponent from '../components/MapComponent';

export default function HomeScreen({ navigation }) {
  const currentLocation = useStore(state => state.currentLocation);
  const isOnline = useStore(state => state.isOnline);
  const volunteerId = useStore(state => state.volunteerId) || 2; // Fallback to 2 for testing
  const setActiveDelivery = useStore(state => state.setActiveDelivery);
  
  useEffect(() => {
    console.log('Volunteer ID:', volunteerId);
    console.log('API URL:', api.defaults.baseURL);
  }, []);

  const [nearbyDonation, setNearbyDonation] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [loading, setLoading] = useState(false);

  const fetchDonations = useCallback(async () => {
    if (!isOnline || !currentLocation) {
      setStatus(isOnline ? 'No location' : 'Offline');
      return;
    }

    setLoading(true);
    setStatus('Fetching...');
    try {
      const response = await api.get(
        `/donations/nearby?lat=${currentLocation.latitude}&lng=${currentLocation.longitude}`
      );
      console.log('API Response:', JSON.stringify(response.data));
      
      if (response.data && response.data.length > 0) {
        setNearbyDonation(response.data[0]);
        setStatus(`Found ${response.data.length} donation(s)`);
      } else {
        setNearbyDonation(null);
        setStatus('No donations nearby');
      }
    } catch (error) {
      console.error('Fetch failed:', error.message);
      setStatus(`Error: ${error.message}`);
      setNearbyDonation(null);
    } finally {
      setLoading(false);
    }
  }, [isOnline, currentLocation]);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, [fetchDonations]);

  const handleAccept = async () => {
    try {
      if (!nearbyDonation.delivery_id) {
        alert('This donation is already being processed.');
        return;
      }
      await api.post('/deliveries/accept', {
        volunteer_id: volunteerId,
        delivery_id: nearbyDonation.delivery_id
      });
      setActiveDelivery(nearbyDonation);
      navigation.navigate('ActivePickup');
    } catch (error) {
      console.log('Accept failed', error);
      alert('Could not accept delivery. It might have been taken by someone else.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>RescueRoute</Text>
          <Text style={{ fontSize: 10, color: '#ccc' }}>ID: {volunteerId}</Text>
        </View>
        <View style={styles.statusRow}>
          {loading && <ActivityIndicator size="small" color="#FC8019" />}
          <Text style={styles.statusText} numberOfLines={1}>{status}</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchDonations}>
            <Text style={styles.refreshBtnText}>↻</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <MapComponent
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        marker={nearbyDonation ? {
          coordinate: { latitude: parseFloat(nearbyDonation.lat), longitude: parseFloat(nearbyDonation.lng) },
          title: nearbyDonation.restaurant_name
        } : null}
      />

      {nearbyDonation && (
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.title}>New Pickup Request</Text>
          <View style={styles.infoRow}>
            <Text style={styles.restaurant}>{nearbyDonation.restaurant_name}</Text>
            <Text style={styles.distance}>{nearbyDonation.distance}</Text>
          </View>
          <Text style={styles.detail}>{nearbyDonation.quantity} meals • {nearbyDonation.food_details}</Text>
          <Text style={styles.urgent}>Expires: {new Date(nearbyDonation.expiry_time).toLocaleTimeString()}</Text>
          
          <View style={styles.row}>
            <TouchableOpacity style={styles.declineBtn} onPress={() => setNearbyDonation(null)}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FC8019', letterSpacing: -0.5 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  statusText: { fontSize: 12, color: '#888', fontWeight: '600', flex: 1 },
  refreshBtn: { width: 32, height: 32, backgroundColor: '#FFF5ED', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  refreshBtnText: { fontSize: 18, color: '#FC8019', fontWeight: '700' },
  map: { flex: 1 },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 14, fontWeight: '600', color: '#FC8019', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  restaurant: { fontSize: 20, fontWeight: '700', color: '#333333' },
  distance: { fontSize: 16, fontWeight: '600', color: '#FC8019' },
  detail: { fontSize: 15, color: '#666666', marginBottom: 6 },
  urgent: { fontSize: 14, color: '#f39c12', fontWeight: '600', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  acceptBtn: { backgroundColor: '#FC8019', height: 50, borderRadius: 12, flex: 1, marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  declineBtn: { backgroundColor: '#f9fafb', height: 50, borderRadius: 12, flex: 1, marginRight: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  acceptText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  declineText: { color: '#666666', fontWeight: '600', fontSize: 16 },
});
