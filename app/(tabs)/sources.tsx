import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WaterCarousel from '@/components/WaterCarousel';
import MapFragment from "@/components/MapFragment";
import {START_LOCATION, WATER_SOURCE_MAP_BOUNDARIES} from "@/constants/StaticValues";
import {entries} from "@/constants/DummyValues";

export default () => {
    const [carouselIndex, setCarouselIndex] = useState(0);

    return (
        <View style={styles.container}>
            <MapFragment
                mapFragmentPosition={WATER_SOURCE_MAP_BOUNDARIES}
                markerLocations={entries}
                startLocation={START_LOCATION}
                setCarouselIndex={setCarouselIndex}
            />
            <View style={styles.carouselContainer}>
                <WaterCarousel entries={entries} carouselIndex={carouselIndex}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
});