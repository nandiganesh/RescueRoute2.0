import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useStore from '../store/useStore';

export default function ActivePickupScreen({ navigation }) {
  const { currentLocation, activeDelivery } = useStore();

  if (!activeDelivery) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>RescueRoute</Text>
      </SafeAreaView>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{ latitude: activeDelivery.lat, longitude: activeDelivery.lng }}
          title={activeDelivery.restaurant}
        />
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>En Route to Pickup</Text>
        </View>
        <Text style={styles.title}>{activeDelivery.restaurant}</Text>
        
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{activeDelivery.distance}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>5 mins</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => navigation.navigate('PickupConfirmation')}
        >
          <Text style={styles.btnText}>Arrived at Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
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
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#2ecc71', letterSpacing: -0.5 },
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
  badgeContainer: {
    backgroundColor: '#e8f8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: { color: '#2ecc71', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: '800', color: '#333333', marginBottom: 20 },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoItem: { flex: 1, alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#666666', marginBottom: 4, fontWeight: '500' },
  infoValue: { fontSize: 18, fontWeight: '700', color: '#333333' },
  divider: { width: 1, height: 30, backgroundColor: '#e0e0e0' },
  btn: { backgroundColor: '#2ecc71', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
