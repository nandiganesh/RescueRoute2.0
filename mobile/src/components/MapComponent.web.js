import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapComponent({ style, initialRegion, marker, showsUserLocation }) {
  return (
    <View style={[style, styles.placeholder]}>
      <Text style={styles.title}>[ Map View ]</Text>
      <Text style={styles.subtitle}>Maps are available on mobile</Text>
      {marker && (
        <View style={styles.markerInfo}>
          <Text style={styles.markerText}>Marker: {marker.title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e8f8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#2ecc71', fontSize: 18, fontWeight: '600' },
  subtitle: { color: '#666666', fontSize: 14 },
  markerInfo: { marginTop: 10, padding: 8, backgroundColor: '#ffffff', borderRadius: 8 },
  markerText: { color: '#333333', fontSize: 12, fontWeight: '500' }
});
