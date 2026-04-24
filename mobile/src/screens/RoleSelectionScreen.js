import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelectionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>RescueRoute</Text>
        <Text style={styles.subtitle}>Select your portal</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('RestaurantStack')}
          >
            <View style={styles.iconPlaceholder}><Text style={styles.iconText}>🏨</Text></View>
            <Text style={styles.cardTitle}>Hotel / Restaurant</Text>
            <Text style={styles.cardDesc}>Donate surplus food</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('VolunteerTab')}
          >
            <View style={styles.iconPlaceholder}><Text style={styles.iconText}>🚗</Text></View>
            <Text style={styles.cardTitle}>Volunteer Driver</Text>
            <Text style={styles.cardDesc}>Deliver food to shelters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('ShelterStack')}
          >
            <View style={styles.iconPlaceholder}><Text style={styles.iconText}>🏠</Text></View>
            <Text style={styles.cardTitle}>NGO / Shelter</Text>
            <Text style={styles.cardDesc}>Receive and manage deliveries</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#2ecc71', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#666666', textAlign: 'center', marginBottom: 40, fontWeight: '500' },
  roleContainer: { gap: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  iconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  iconText: { fontSize: 32 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#888888', fontWeight: '500', textAlign: 'center' }
});
