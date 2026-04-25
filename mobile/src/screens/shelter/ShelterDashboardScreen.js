import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';

export default function ShelterDashboardScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ incoming: 0, received: 0 });

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await api.get('/donations/active');
      const incoming = res.data.filter(d => d.status === 'matched' || d.status === 'picked_up');
      setDeliveries(incoming);
      setStats({
        incoming: incoming.length,
        received: res.data.filter(d => d.status === 'completed').length
      });
    } catch (error) {
      console.error('Shelter fetch error:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 5000);
    return () => clearInterval(interval);
  }, [fetchDeliveries]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  };

  const handleConfirmReceipt = (id) => {
    Alert.alert('Confirm Receipt', 'Has the food been safely received?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Received', onPress: () => {
        setDeliveries(prev => prev.filter(d => d.id !== id));
        Alert.alert('Thank you! 🎉', 'The food has been marked as received.');
      }}
    ]);
  };

  const getStatusConfig = (status) => {
    if (status === 'picked_up') return { label: 'On The Way', color: '#FC8019', bg: '#FFF5ED', icon: '🚗' };
    return { label: 'Driver Assigned', color: '#007AFF', bg: '#EBF3FF', icon: '👤' };
  };

  const renderItem = ({ item }) => {
    const config = getStatusConfig(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.foodInfo}>
            <Text style={styles.foodText}>{item.food_details}</Text>
            <Text style={styles.qtyText}>{item.quantity} items</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Text style={{ fontSize: 12 }}>{config.icon}</Text>
            <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        {item.status === 'picked_up' && (
          <TouchableOpacity style={styles.confirmBtn} onPress={() => handleConfirmReceipt(item.id)}>
            <Text style={styles.confirmBtnText}>Confirm Receipt ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>City Shelter</Text>
          <Text style={styles.headerSub}>Incoming Deliveries</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{stats.incoming}</Text>
          <Text style={styles.statLabel}>Incoming</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: '#34C759' }]}>{stats.received}</Text>
          <Text style={styles.statLabel}>Received Today</Text>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={deliveries}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FC8019" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No incoming deliveries</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEEEEE',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#007AFF' },
  headerSub: { fontSize: 13, color: '#888888', fontWeight: '600', marginTop: 2 },
  refreshBtn: { width: 40, height: 40, backgroundColor: '#EBF3FF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  refreshIcon: { fontSize: 20, color: '#007AFF', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 0 },
  statBox: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE' },
  statNum: { fontSize: 28, fontWeight: '900', color: '#FC8019', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#888888', fontWeight: '600' },
  listContainer: { padding: 20 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  foodInfo: { flex: 1, marginRight: 12 },
  foodText: { fontSize: 18, fontWeight: '800', color: '#333333', marginBottom: 4 },
  qtyText: { fontSize: 14, color: '#888888', fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  confirmBtn: { backgroundColor: '#34C759', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 16 },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#888888' },
  emptySubtext: { fontSize: 14, color: '#BBBBBB', marginTop: 4 },
});
