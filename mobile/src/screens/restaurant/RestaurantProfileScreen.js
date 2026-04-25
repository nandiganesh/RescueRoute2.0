import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../../store/useStore';

export default function RestaurantProfileScreen({ navigation }) {
  const logout = useStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>
          <Text style={styles.nameText}>Fresh Bakes Restaurant</Text>
          <Text style={styles.subText}>123 Main St, Hyderabad</Text>
          <Text style={styles.subText}>Open: 9 AM - 10 PM</Text>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DonationHistory')}>
          <Text style={styles.menuText}>Donation History</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notification Preferences</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
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
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backBtnText: { fontSize: 32, color: '#333333', lineHeight: 32 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333333' },
  container: { padding: 20 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF5ED', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#FC8019' },
  nameText: { fontSize: 20, fontWeight: '800', color: '#333333', marginBottom: 8 },
  subText: { fontSize: 14, color: '#888888', marginBottom: 4 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  menuText: { fontSize: 16, fontWeight: '600', color: '#333333' },
  menuArrow: { fontSize: 24, color: '#CCCCCC' },
  footer: { padding: 20, backgroundColor: '#FAFAFA' },
  logoutBtn: { backgroundColor: '#FFEEED', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFDADA' },
  logoutBtnText: { color: '#E23744', fontSize: 18, fontWeight: '800' }
});
