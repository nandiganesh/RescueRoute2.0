import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/useStore';

export default function ProfileScreen() {
  const { isOnline, setOnline } = useStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <View style={[styles.statusBadge, isOnline ? styles.statusOnline : styles.statusOffline]}>
            <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <Text style={[styles.statusText, isOnline ? styles.statusTextOnline : styles.statusTextOffline]}>
              {isOnline ? 'AVAILABLE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>142</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>350</Text>
            <Text style={styles.statLabel}>Meals</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Go Online</Text>
              <Text style={styles.toggleDesc}>Accept new delivery requests</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setOnline}
              trackColor={{ false: '#EEEEEE', true: '#FC8019' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#EEEEEE"
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuItemText}>Account Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuItemText}>My Stats</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flexGrow: 1, padding: 20 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 32 },
  avatar: { 
    width: 96, height: 96, borderRadius: 32, backgroundColor: '#FFF5ED', 
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#FC8019' },
  name: { fontSize: 24, fontWeight: '900', color: '#333333', marginBottom: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, gap: 6 },
  statusOnline: { backgroundColor: '#E8F8F0' },
  statusOffline: { backgroundColor: '#F5F5F5' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dotOnline: { backgroundColor: '#34C759' },
  dotOffline: { backgroundColor: '#CCCCCC' },
  statusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  statusTextOnline: { color: '#34C759' },
  statusTextOffline: { color: '#888888' },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { 
    flex: 1, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, alignItems: 'center',
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  statNum: { fontSize: 28, fontWeight: '900', color: '#FC8019', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#888888', fontWeight: '600' },
  
  menuSection: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  toggleRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  toggleLabel: { fontSize: 16, fontWeight: '700', color: '#333333' },
  toggleDesc: { fontSize: 12, color: '#AAAAAA', fontWeight: '500', marginTop: 2 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuItemText: { fontSize: 16, fontWeight: '600', color: '#333333', flex: 1 },
  menuArrow: { fontSize: 22, color: '#CCCCCC' },
  
  logoutBtn: { 
    height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFEEED', borderWidth: 1, borderColor: '#FFDADA', marginBottom: 20,
  },
  logoutText: { color: '#E23744', fontSize: 16, fontWeight: '800' },
});
