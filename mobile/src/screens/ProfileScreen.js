import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
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
            <Text style={[styles.statusText, isOnline ? styles.statusTextOnline : styles.statusTextOffline]}>
              {isOnline ? 'AVAILABLE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>142</Text>
            <Text style={styles.statLabel}>Total Deliveries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>350</Text>
            <Text style={styles.statLabel}>Meals Delivered</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Go Online</Text>
            <Switch
              value={isOnline}
              onValueChange={setOnline}
              trackColor={{ false: '#e0e0e0', true: '#2ecc71' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Account Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
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
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flexGrow: 1, padding: 20 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 32 },
  avatar: { 
    width: 96, 
    height: 96, 
    borderRadius: 48, 
    backgroundColor: '#a8e6cf', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16 
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#2ecc71' },
  name: { fontSize: 24, fontWeight: '800', color: '#333333', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusOnline: { backgroundColor: '#e8f8f0' },
  statusOffline: { backgroundColor: '#f0f0f0' },
  statusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  statusTextOnline: { color: '#2ecc71' },
  statusTextOffline: { color: '#666666' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statBox: { 
    flex: 1, 
    backgroundColor: '#ffffff', 
    marginHorizontal: 6, 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statNum: { fontSize: 28, fontWeight: '800', color: '#2ecc71', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#666666', fontWeight: '500' },
  
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  toggleLabel: { fontSize: 16, fontWeight: '600', color: '#333333' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  menuItemText: { fontSize: 16, fontWeight: '500', color: '#333333' },
  menuArrow: { fontSize: 20, color: '#cccccc' },
  
  logoutBtn: { 
    height: 56, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    marginBottom: 20
  },
  logoutText: { color: '#333333', fontSize: 16, fontWeight: '700' }
});
