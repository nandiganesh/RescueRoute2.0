import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { confirmDelivery } from '../services/api';
import useStore from '../store/useStore';

export default function DeliveryCompletionScreen({ navigation }) {
  const { volunteerId, activeDelivery, clearActiveDelivery } = useStore();
  const [photo, setPhoto] = useState(null);
  const [notes, setNotes] = useState('');

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleComplete = async () => {
    if (!photo) {
      alert("Delivery photo is required.");
      return;
    }
    // await confirmDelivery(volunteerId, activeDelivery.id, photo, notes);
    clearActiveDelivery();
    alert('Delivery Completed! Thank you.');
    navigation.navigate('HomeMap');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Delivery</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Evidence</Text>
          {!photo ? (
            <TouchableOpacity style={styles.uploadArea} onPress={takePhoto}>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>Take a photo of the delivered food</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={takePhoto}>
              <Image source={{ uri: photo }} style={styles.preview} />
              <Text style={styles.retakeText}>Tap to retake photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          <TextInput 
            style={styles.input}
            placeholder="Optional: Handed to manager, left at door..."
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.confirmBtn, !photo && styles.disabled]} 
            onPress={handleComplete}
          >
            <Text style={styles.confirmText}>Finish Delivery</Text>
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
  input: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 12, 
    padding: 16, 
    height: 100, 
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#333333',
    backgroundColor: '#fafafa'
  },
  bottomContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  confirmBtn: { backgroundColor: '#2ecc71', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: '#d5d5d5' },
  confirmText: { color: '#ffffff', fontWeight: '700', fontSize: 18 },
});
