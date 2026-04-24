import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import useStore from '../../store/useStore';

export default function RestaurantDashboardScreen({ navigation }) {
  const restaurantId = useStore(state => state.restaurantId);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
    
    // Auto refresh every 5 seconds for demo purposes
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations/active');
      const myDonations = res.data.filter(d => d.restaurant_id === restaurantId);
      setDonations(myDonations);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodText}>{item.food_details}</Text>
        <View style={[styles.statusBadge, item.status === 'accepted' ? styles.statusAccepted : null]}>
          <Text style={[styles.statusText, item.status === 'accepted' ? styles.statusTextAccepted : null]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.qtyText}>Quantity: {item.quantity}</Text>
      <Text style={styles.timeText}>Expires: {new Date(item.expiry_time).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Donations</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={donations}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No active donations. You're doing great, donate some food!</Text>}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.donateBtn} 
          onPress={() => navigation.navigate('NewDonation')}
        >
          <Text style={styles.donateBtnText}>+ Donate Food</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backBtnText: { fontSize: 32, color: '#333333', lineHeight: 32 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333333' },
  listContainer: { padding: 20 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  foodText: { fontSize: 18, fontWeight: '700', color: '#333333', flex: 1 },
  statusBadge: { backgroundColor: '#fff3cd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#856404', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  statusAccepted: { backgroundColor: '#e8f8f0' },
  statusTextAccepted: { color: '#2ecc71' },
  qtyText: { fontSize: 15, color: '#555555', marginBottom: 4 },
  timeText: { fontSize: 14, color: '#888888' },
  emptyText: { textAlign: 'center', color: '#888888', marginTop: 40, fontSize: 16, paddingHorizontal: 20 },
  footer: { padding: 20, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  donateBtn: { backgroundColor: '#2ecc71', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  donateBtnText: { color: '#ffffff', fontSize: 18, fontWeight: '700' }
});
