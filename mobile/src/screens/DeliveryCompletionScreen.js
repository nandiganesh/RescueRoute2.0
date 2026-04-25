import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { confirmDelivery } from '../services/api';
import useStore from '../store/useStore';

export default function DeliveryCompletionScreen({ navigation }) {
  const { volunteerId, activeDelivery, clearActiveDelivery } = useStore();
  const [photo, setPhoto] = useState(null);
  const [notes, setNotes] = useState('');

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
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
    clearActiveDelivery();
    alert('Delivery Completed! Thank you. 🎉');
    navigation.navigate('HomeMap');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Delivery</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📸 Delivery Photo</Text>
            {!photo ? (
              <TouchableOpacity style={styles.uploadArea} onPress={takePhoto}>
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadText}>Photograph the delivered food</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={takePhoto}>
                <Image source={{ uri: photo }} style={styles.preview} />
                <Text style={styles.retakeText}>Tap to retake</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📝 Notes (optional)</Text>
            <TextInput 
              style={styles.input}
              placeholder="Handed to manager, left at door..."
              placeholderTextColor="#BBBBBB"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.confirmBtn, !photo && styles.disabled]} 
            onPress={handleComplete}
          >
            <Text style={styles.confirmText}>Finish Delivery ✓</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  container: { padding: 20, paddingBottom: 10 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#333333', marginBottom: 16 },
  uploadArea: {
    borderWidth: 2, borderColor: '#EEEEEE', borderStyle: 'dashed', borderRadius: 16,
    padding: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA',
  },
  uploadIcon: { fontSize: 36, marginBottom: 8 },
  uploadText: { fontSize: 15, color: '#888888', fontWeight: '500' },
  preview: { width: '100%', height: 200, borderRadius: 16 },
  retakeText: { textAlign: 'center', marginTop: 12, color: '#34C759', fontWeight: '700' },
  input: { 
    borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 16, padding: 16, height: 100, 
    textAlignVertical: 'top', fontSize: 16, color: '#333333', backgroundColor: '#FAFAFA',
    fontWeight: '500',
  },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  confirmBtn: { backgroundColor: '#34C759', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#34C759', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  disabled: { backgroundColor: '#DDDDDD', shadowOpacity: 0 },
  confirmText: { color: '#FFFFFF', fontWeight: '900', fontSize: 18 },
});
