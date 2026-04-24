import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import useStore from '../../store/useStore';

export default function NewDonationScreen({ navigation }) {
  const restaurantId = useStore(state => state.restaurantId);
  const [foodDetails, setFoodDetails] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryHours, setExpiryHours] = useState('2');

  const handleSubmit = async () => {
    if (!foodDetails || !quantity) {
      Alert.alert('Error', 'Please fill in food details and quantity.');
      return;
    }

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(expiryHours));

      await api.post('/donations', {
        restaurant_id: restaurantId,
        food_details: foodDetails,
        quantity: parseInt(quantity),
        expiry_time: expiryTime.toISOString()
      });

      Alert.alert('Success', 'Donation created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create donation.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Donation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Food Details</Text>
          <TextInput
            style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
            placeholder="e.g. 20 Sandwiches and 5 Salads"
            value={foodDetails}
            onChangeText={setFoodDetails}
            multiline
          />

          <Text style={styles.label}>Quantity (Servings/Items)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 25"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Expires in (Hours)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            value={expiryHours}
            onChangeText={setExpiryHours}
            keyboardType="numeric"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Once submitted, local volunteer drivers will be notified to pick up this donation.</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Donation</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  container: { padding: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 8 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    marginBottom: 24
  },
  infoBox: {
    backgroundColor: '#e8f8f0',
    padding: 16,
    borderRadius: 12,
    marginTop: 16
  },
  infoText: { color: '#2ecc71', fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 20 },
  footer: { padding: 20, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  submitBtn: { backgroundColor: '#2ecc71', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#ffffff', fontSize: 18, fontWeight: '700' }
});
