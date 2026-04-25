import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { confirmPickup } from '../services/api';
import useStore from '../store/useStore';

export default function PickupConfirmationScreen({ navigation }) {
  const { volunteerId, activeDelivery } = useStore();
  const [photo, setPhoto] = useState(null);
  const [checks, setChecks] = useState({ sealed: false, expiry: false, safe: false });

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const allChecked = checks.sealed && checks.expiry && checks.safe && photo;

  const handleConfirm = async () => {
    if (!allChecked) {
      alert("Please complete all checklist items and take a photo.");
      return;
    }
    navigation.navigate('DeliveryNavigation');
  };

  const toggleCheck = (key) => {
    setChecks({ ...checks, [key]: !checks[key] });
  };

  const checklistItems = [
    { key: 'sealed', label: 'Food is properly sealed', icon: '📦' },
    { key: 'expiry', label: 'Within expiry time', icon: '⏱️' },
    { key: 'safe', label: 'Safe temperature & condition', icon: '✅' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Pickup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Safety Checklist</Text>
          {checklistItems.map(item => (
            <TouchableOpacity key={item.key} style={styles.checkItem} onPress={() => toggleCheck(item.key)}>
              <View style={[styles.checkbox, checks[item.key] && styles.checkboxActive]}>
                {checks[item.key] && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={styles.checkEmoji}>{item.icon}</Text>
              <Text style={[styles.checkText, checks[item.key] && styles.checkTextDone]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photo Evidence</Text>
          {!photo ? (
            <TouchableOpacity style={styles.uploadArea} onPress={takePhoto}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to photograph the food</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={takePhoto}>
              <Image source={{ uri: photo }} style={styles.preview} />
              <Text style={styles.retakeText}>Tap to retake</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmBtn, !allChecked && styles.disabled]} 
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>Confirm Pickup</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backText: { fontSize: 32, color: '#333333', lineHeight: 32 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333333' },
  scrollView: { flex: 1 },
  container: { padding: 20, paddingBottom: 10 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#333333', marginBottom: 16 },
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  checkbox: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: '#DDDDDD',
    marginRight: 12, alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: '#FC8019', borderColor: '#FC8019' },
  checkIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  checkEmoji: { fontSize: 18, marginRight: 10 },
  checkText: { fontSize: 16, color: '#555555', fontWeight: '500', flex: 1 },
  checkTextDone: { color: '#333333', fontWeight: '600' },
  uploadArea: {
    borderWidth: 2, borderColor: '#EEEEEE', borderStyle: 'dashed', borderRadius: 16,
    padding: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA',
  },
  uploadIcon: { fontSize: 36, marginBottom: 8 },
  uploadText: { fontSize: 15, color: '#888888', fontWeight: '500' },
  preview: { width: '100%', height: 200, borderRadius: 16 },
  retakeText: { textAlign: 'center', marginTop: 12, color: '#FC8019', fontWeight: '700' },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  confirmBtn: { backgroundColor: '#FC8019', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#FC8019', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  disabled: { backgroundColor: '#DDDDDD', shadowOpacity: 0 },
  confirmText: { color: '#FFFFFF', fontWeight: '900', fontSize: 18 },
});
