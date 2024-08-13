import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, View} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {HelloWave} from "@/components/HelloWave";

const markerLocations = [
    {latitude: 37.78825, longitude: -122.4324, title: 'Location 1'},
    {latitude: 37.78925, longitude: -122.4334, title: 'Location 2'},
    // Add more locations as needed
];

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: 40,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
});

export default () => (
    <View style={styles.container}>
        <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
        >
            {markerLocations.map((location, index) => (
                <Marker
                    key={index}
                    coordinate={{latitude: location.latitude, longitude: location.longitude}}
                    title={location.title}
                />
            ))}
        </MapView>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Welcome!</ThemedText>
            <HelloWave/>
        </ThemedView>
    </View>
);