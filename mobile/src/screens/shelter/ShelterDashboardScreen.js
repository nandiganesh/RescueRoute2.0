import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

export default function ShelterDashboardScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries();
    
    // Auto refresh every 5 seconds for demo
    const interval = setInterval(fetchDeliveries, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/donations/active');
      // Show donations that are matched or picked_up (incoming to shelter)
      const incoming = res.data.filter(d => d.status === 'matched' || d.status === 'picked_up');
      setDeliveries(incoming);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmReceipt = (id) => {
    Alert.alert('Delivery Confirmed', 'Thank you! The food has been successfully received.', [
      { text: 'OK', onPress: () => fetchDeliveries() }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodText}>{item.food_details}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status === 'matched' ? 'Driver Assigned' : 'On The Way'}</Text>
        </View>
      </View>
      <Text style={styles.qtyText}>Quantity: {item.quantity}</Text>
      
      {item.status === 'picked_up' && (
        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleConfirmReceipt(item.id)}>
          <Text style={styles.acceptBtnText}>Confirm Receipt</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incoming Deliveries</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={deliveries}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No incoming deliveries right now.</Text>}
      />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  foodText: { fontSize: 18, fontWeight: '700', color: '#333333', flex: 1, marginRight: 8 },
  statusBadge: { backgroundColor: '#e8f8f0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#2ecc71', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  qtyText: { fontSize: 15, color: '#555555', marginBottom: 16 },
  acceptBtn: { backgroundColor: '#2ecc71', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  acceptBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#888888', marginTop: 40, fontSize: 16 }
});
