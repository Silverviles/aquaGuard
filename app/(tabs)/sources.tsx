import React from 'react';
import {StyleSheet, View} from 'react-native';
import WaterCarousel from '@/components/WaterCarousel';
import MapFragment from "@/components/MapFragment";

const dummyLocations = [
    {latitude: 37.7749, longitude: -122.4194, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "San Francisco"},
    {latitude: 34.0522, longitude: -118.2437, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "Los Angeles"},
    {latitude: 40.7128, longitude: -74.0060, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "New York"},
    {latitude: 41.8781, longitude: -87.6298, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "Chicago"},
    {latitude: 29.7604, longitude: -95.3698, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "Houston"}
];

const entries = [
    {title: 'Entry 1', description: 'Description for entry 1'},
    {title: 'Entry 2', description: 'Description for entry 2'},
    {title: 'Entry 3', description: 'Description for entry 3'},
];

export default () => (
    <View style={styles.container}>
        <MapFragment
            location={{left: 0, right: 0, top: 40, bottom: 0}}
            markerLocations={dummyLocations}
            startLocation={{
                latitude: 6.9143498,
                longitude: 79.972684,
                latitudeDelta: 0.05,
                longitudeDelta: 0.0421,
                title: "Start"
            }}
        />
        <View style={styles.carouselContainer}>
            <WaterCarousel entries={entries}/>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
});