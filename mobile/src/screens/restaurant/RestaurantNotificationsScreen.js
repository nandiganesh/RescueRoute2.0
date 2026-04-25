import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantNotificationsScreen({ navigation }) {
  // Mock notifications
  const notifications = [
    { id: '1', title: 'Volunteer Assigned', desc: 'Rahul is on the way to pick up 20 Meals.', time: '2 mins ago', type: 'info' },
    { id: '2', title: 'Pickup Arriving', desc: 'Volunteer is 1 km away.', time: '10 mins ago', type: 'alert' },
    { id: '3', title: 'Delivery Completed', desc: '20 Meals delivered to City Shelter.', time: '1 hour ago', type: 'success' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.iconBox, item.type === 'success' ? styles.iconSuccess : item.type === 'alert' ? styles.iconAlert : styles.iconInfo]}>
        <Text style={styles.iconText}>
          {item.type === 'success' ? '✓' : item.type === 'alert' ? '!' : 'i'}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descText}>{item.desc}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  iconSuccess: { backgroundColor: '#E8F8F0' },
  iconAlert: { backgroundColor: '#FFF5ED' },
  iconInfo: { backgroundColor: '#F0F4FF' },
  iconText: { fontSize: 18, fontWeight: '800', color: '#555555' },
  content: { flex: 1 },
  titleText: { fontSize: 16, fontWeight: '700', color: '#333333', marginBottom: 4 },
  descText: { fontSize: 14, color: '#555555', marginBottom: 8, lineHeight: 20 },
  timeText: { fontSize: 12, color: '#AAAAAA', fontWeight: '600' }
});
