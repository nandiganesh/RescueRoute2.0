import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/useStore';
import MapComponent from '../components/MapComponent';

export default function ActivePickupScreen({ navigation }) {
  const { currentLocation, activeDelivery } = useStore();

  if (!activeDelivery) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>RescueRoute</Text>
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
        marker={{
          coordinate: { latitude: parseFloat(activeDelivery.lat), longitude: parseFloat(activeDelivery.lng) },
          title: activeDelivery.restaurant_name || activeDelivery.restaurant
        }}
      />

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>En Route to Pickup</Text>
        </View>
        <Text style={styles.title}>{activeDelivery.restaurant_name || activeDelivery.restaurant}</Text>
        
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{activeDelivery.distance}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Items</Text>
            <Text style={styles.infoValue}>{activeDelivery.quantity}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>5 min</Text>
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
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    zIndex: 10,
    elevation: 2,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FC8019', letterSpacing: -0.5 },
  map: { flex: 1 },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
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
  dragHandle: { width: 40, height: 4, backgroundColor: '#EEEEEE', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  badgeContainer: { backgroundColor: '#FFF5ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 12 },
  badgeText: { color: '#FC8019', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: '800', color: '#333333', marginBottom: 20 },
  infoBox: { flexDirection: 'row', backgroundColor: '#FAFAFA', borderRadius: 16, padding: 16, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE' },
  infoItem: { flex: 1, alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#888888', marginBottom: 4, fontWeight: '600' },
  infoValue: { fontSize: 18, fontWeight: '800', color: '#333333' },
  divider: { width: 1, height: 30, backgroundColor: '#EEEEEE' },
  btn: { backgroundColor: '#FC8019', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#FC8019', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  btnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
});
