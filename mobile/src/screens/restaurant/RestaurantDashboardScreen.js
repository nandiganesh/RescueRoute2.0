import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import useStore from '../../store/useStore';

export default function RestaurantDashboardScreen({ navigation }) {
  const restaurantId = useStore(state => state.restaurantId);
  const [donations, setDonations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations/active');
      const myDonations = res.data.filter(d => d.restaurant_id === restaurantId);
      // Sort by newest first
      myDonations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDonations(myDonations);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeDonation = donations.length > 0 ? donations[0] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* App Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RescueRoute</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('RestaurantNotifications')}>
            <Text style={styles.iconBtnText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('RestaurantProfile')}>
            <Text style={styles.iconBtnText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{donations.length}</Text>
            <Text style={styles.statLabel}>Meals Donated</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Rescue Rate</Text>
          </View>
        </View>

        {/* Active Status Card */}
        {activeDonation ? (
          <View style={styles.activeCard}>
            <Text style={styles.cardTitle}>Current Status</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusIndicator, activeDonation.status === 'assigned' ? styles.activeDot : null]} />
              <Text style={styles.statusText}>
                {activeDonation.status === 'available' ? 'Waiting for Volunteer...' : 
                 activeDonation.status === 'assigned' ? 'Volunteer Assigned' : 
                 activeDonation.status === 'picked_up' ? 'Food Picked Up' : 'Completed'}
              </Text>
            </View>
            <Text style={styles.foodDetailsText}>{activeDonation.food_details} ({activeDonation.quantity} items)</Text>
            {activeDonation.status === 'assigned' && (
              <View style={styles.volunteerInfo}>
                <Text style={styles.volText}>🚗 Driver is on the way</Text>
                <Text style={styles.etaText}>ETA: 5 mins</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active donations right now.</Text>
          </View>
        )}
      </ScrollView>

      {/* Prominent Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.donateBtn} 
          onPress={() => navigation.navigate('NewDonation')}
        >
          <Text style={styles.donateBtnText}>Donate Surplus Food</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FC8019', letterSpacing: -0.5 },
  iconBtn: { width: 40, height: 40, backgroundColor: '#FFF5ED', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  iconBtnText: { fontSize: 18 },
  container: { padding: 20 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEEEEE', alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#333333', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#888888', fontWeight: '600', textTransform: 'uppercase' },
  activeCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, shadowColor: '#FC8019', shadowOpacity: 0.1, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 5, borderWidth: 1, borderColor: '#FFF5ED' },
  cardTitle: { fontSize: 14, color: '#888888', fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFC107', marginRight: 8 },
  activeDot: { backgroundColor: '#2ECC71' },
  statusText: { fontSize: 18, fontWeight: '800', color: '#333333' },
  foodDetailsText: { fontSize: 15, color: '#555555', marginBottom: 16, fontWeight: '500' },
  volunteerInfo: { backgroundColor: '#FFF5ED', padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  volText: { fontSize: 14, fontWeight: '700', color: '#D35400' },
  etaText: { fontSize: 14, fontWeight: '700', color: '#D35400' },
  emptyCard: { backgroundColor: '#FFFFFF', padding: 32, borderRadius: 20, borderWidth: 1, borderColor: '#EEEEEE', alignItems: 'center', borderStyle: 'dashed' },
  emptyText: { color: '#AAAAAA', fontSize: 16, fontWeight: '500' },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  donateBtn: { backgroundColor: '#FC8019', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#FC8019', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  donateBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' }
});
