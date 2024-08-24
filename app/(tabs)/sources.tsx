import React from 'react';
import {StyleSheet, View} from 'react-native';
import WaterCarousel from '@/components/WaterCarousel';
import MapFragment from "@/components/MapFragment";
import {START_LOCATION, WATER_SOURCE_MAP_BOUNDARIES} from "@/constants/StaticValues";
import {entries} from "@/constants/DummyValues";

export default () => (
    <View style={styles.container}>
        <MapFragment
            mapFragmentPosition={WATER_SOURCE_MAP_BOUNDARIES}
            markerLocations={entries}
            startLocation={START_LOCATION}
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