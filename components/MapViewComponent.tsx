import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

interface MapProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function MapViewComponent({ location }: MapProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
