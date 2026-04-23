import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { confirmPickup } from '../services/api';
import useStore from '../store/useStore';

export default function PickupConfirmationScreen({ navigation }) {
  const { volunteerId, activeDelivery } = useStore();
  const [photo, setPhoto] = useState(null);
  const [checks, setChecks] = useState({ sealed: false, expiry: false, safe: false });

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleConfirm = async () => {
    if (!checks.sealed || !checks.expiry || !checks.safe || !photo) {
      alert("Please complete all checklist items and take a photo.");
      return;
    }
    // API mock
    // await confirmPickup(volunteerId, activeDelivery.id, photo);
    navigation.navigate('DeliveryNavigation');
  };

  const toggleCheck = (key) => {
    setChecks({ ...checks, [key]: !checks[key] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Pickup</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Safety Checklist</Text>
          
          <TouchableOpacity style={styles.checkItem} onPress={() => toggleCheck('sealed')}>
            <View style={[styles.checkbox, checks.sealed && styles.checkboxActive]}>
              {checks.sealed && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Food is sealed properly</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.checkItem} onPress={() => toggleCheck('expiry')}>
            <View style={[styles.checkbox, checks.expiry && styles.checkboxActive]}>
              {checks.expiry && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Within expiry time</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkItem} onPress={() => toggleCheck('safe')}>
            <View style={[styles.checkbox, checks.safe && styles.checkboxActive]}>
              {checks.safe && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkText}>Safe condition</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photo Evidence</Text>
          {!photo ? (
            <TouchableOpacity style={styles.uploadArea} onPress={takePhoto}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to take a photo of the food</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={takePhoto}>
              <Image source={{ uri: photo }} style={styles.preview} />
              <Text style={styles.retakeText}>Tap to retake photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.confirmBtn, (!checks.sealed || !checks.expiry || !checks.safe || !photo) && styles.disabled]} 
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>Confirm Pickup</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { width: 60 },
  backText: { color: '#2ecc71', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333333' },
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333333', marginBottom: 16 },
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  checkIcon: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  checkText: { fontSize: 16, color: '#333333', fontWeight: '500' },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadText: { fontSize: 14, color: '#666666', fontWeight: '500' },
  preview: { width: '100%', height: 200, borderRadius: 12 },
  retakeText: { textAlign: 'center', marginTop: 12, color: '#2ecc71', fontWeight: '600' },
  bottomContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  confirmBtn: { backgroundColor: '#2ecc71', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: '#d5d5d5' },
  confirmText: { color: '#ffffff', fontWeight: '700', fontSize: 18 },
});
