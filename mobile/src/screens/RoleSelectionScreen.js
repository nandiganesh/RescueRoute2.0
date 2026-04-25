import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelectionScreen({ navigation }) {
  const roles = [
    { key: 'RestaurantStack', icon: '🏨', title: 'Hotel / Restaurant', desc: 'Donate surplus food', color: '#FC8019', bg: '#FFF5ED' },
    { key: 'VolunteerTab', icon: '🚗', title: 'Volunteer Driver', desc: 'Deliver food to shelters', color: '#34C759', bg: '#E8F8F0' },
    { key: 'ShelterStack', icon: '🏠', title: 'NGO / Shelter', desc: 'Receive and manage deliveries', color: '#007AFF', bg: '#EBF3FF' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🍽️</Text>
          </View>
          <Text style={styles.title}>RescueRoute</Text>
          <Text style={styles.subtitle}>Zero hunger. Zero waste.</Text>
        </View>

        <Text style={styles.selectLabel}>Choose your role</Text>

        <View style={styles.roleContainer}>
          {roles.map(role => (
            <TouchableOpacity 
              key={role.key}
              style={styles.card} 
              onPress={() => navigation.navigate(role.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: role.bg }]}>
                <Text style={styles.iconText}>{role.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{role.title}</Text>
                <Text style={styles.cardDesc}>{role.desc}</Text>
              </View>
              <Text style={[styles.arrow, { color: role.color }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerText}>v3.0 • Saving food, feeding hope</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoBadge: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF5ED', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 36, fontWeight: '900', color: '#FC8019', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#888888', fontWeight: '600', marginTop: 4 },
  selectLabel: { fontSize: 14, fontWeight: '700', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  roleContainer: { gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconCircle: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  iconText: { fontSize: 28 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#333333', marginBottom: 2 },
  cardDesc: { fontSize: 14, color: '#888888', fontWeight: '500' },
  arrow: { fontSize: 28, fontWeight: '300' },
  footerText: { textAlign: 'center', color: '#CCCCCC', fontSize: 12, fontWeight: '600', marginTop: 40 },
});
