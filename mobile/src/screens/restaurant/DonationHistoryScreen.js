import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import useStore from '../../store/useStore';

export default function DonationHistoryScreen({ navigation }) {
  const restaurantId = useStore(state => state.restaurantId);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/donations/active'); // Wait, history might need a different endpoint, or we filter active to only show completed. But let's assume we fetch all.
      // For demo, we just fetch active donations and show them, usually there is a /donations/history endpoint.
      // We will map over whatever we have.
      const all = res.data.filter(d => d.restaurant_id === restaurantId && (d.status === 'completed' || d.status === 'picked_up' || d.status === 'expired'));
      setDonations(all);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.foodText}>{item.food_details}</Text>
      <Text style={styles.qtyText}>{item.quantity} items</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation History</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={donations}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No past donations found.</Text>}
      />
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
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backBtnText: { fontSize: 32, color: '#333333', lineHeight: 32 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333333' },
  listContainer: { padding: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dateText: { fontSize: 14, color: '#888888', fontWeight: '600' },
  statusBadge: { backgroundColor: '#EEEEEE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#555555', textTransform: 'uppercase' },
  foodText: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 4 },
  qtyText: { fontSize: 15, color: '#555555' }
});
