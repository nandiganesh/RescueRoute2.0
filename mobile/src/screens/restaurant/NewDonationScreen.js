import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import useStore from '../../store/useStore';

export default function NewDonationScreen({ navigation }) {
  const restaurantId = useStore(state => state.restaurantId);
  const [foodDetails, setFoodDetails] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [expiryHours, setExpiryHours] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!foodDetails) {
      Alert.alert('Required', 'Please enter what food you are donating.');
      return;
    }

    setIsSubmitting(true);
    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + expiryHours);

      await api.post('/donations', {
        restaurant_id: restaurantId,
        food_details: foodDetails,
        quantity: quantity,
        expiry_time: expiryTime.toISOString()
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create donation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Donation</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>What are you donating?</Text>
          <TextInput
            style={styles.inputLarge}
            placeholder="e.g. 20 Sandwiches"
            value={foodDetails}
            onChangeText={setFoodDetails}
            autoFocus
          />

          <Text style={styles.label}>Quantity</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setQuantity(Math.max(1, quantity - 5))}>
              <Text style={styles.stepperText}>-</Text>
            </TouchableOpacity>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityNumber}>{quantity}</Text>
            </View>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => setQuantity(quantity + 5)}>
              <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Expires In</Text>
          <View style={styles.chipsContainer}>
            {[1, 2, 4].map(h => (
              <TouchableOpacity 
                key={h} 
                style={[styles.chip, expiryHours === h && styles.chipActive]}
                onPress={() => setExpiryHours(h)}
              >
                <Text style={[styles.chipText, expiryHours === h && styles.chipTextActive]}>
                  {h} Hour{h > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitBtnText}>{isSubmitting ? 'Posting...' : 'Post Donation'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  backBtnText: { fontSize: 24, color: '#333333', fontWeight: '800' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#333333' },
  container: { flex: 1, padding: 24 },
  label: { fontSize: 16, fontWeight: '800', color: '#333333', marginBottom: 12, marginTop: 16 },
  inputLarge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    padding: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  stepperBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF5ED',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepperText: { fontSize: 32, fontWeight: '600', color: '#FC8019', lineHeight: 36 },
  quantityDisplay: { flex: 1, alignItems: 'center' },
  quantityNumber: { fontSize: 32, fontWeight: '900', color: '#333333' },
  chipsContainer: {
    flexDirection: 'row',
    gap: 12
  },
  chip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1
  },
  chipActive: {
    backgroundColor: '#FFF5ED',
    borderColor: '#FC8019',
    borderWidth: 2
  },
  chipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#888888'
  },
  chipTextActive: {
    color: '#FC8019'
  },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  submitBtn: { backgroundColor: '#FC8019', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#FC8019', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' }
});
