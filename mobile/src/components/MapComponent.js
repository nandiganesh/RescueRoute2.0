import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function MapComponent({ style, initialRegion, marker, showsUserLocation }) {
  return (
    <MapView
      style={style}
      initialRegion={initialRegion}
      showsUserLocation={showsUserLocation}
    >
      {marker && (
        <Marker
          coordinate={marker.coordinate}
          title={marker.title}
        />
      )}
    </MapView>
  );
}
