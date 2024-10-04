import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WaterCarousel from '@/components/WaterCarousel';
import MapFragment from "@/components/MapFragment";
import {START_LOCATION, WATER_SOURCE_MAP_BOUNDARIES} from "@/constants/StaticValues";
import {entries} from "@/constants/DummyValues";
import SourceForm from "@/components/SourceForm";

export default () => {
    const [carouselId, setCarouselId] = useState('');
    const [showForm, setShowForm] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.roundButton} onPress={() => setShowForm(!showForm)}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            {
                showForm ? (
                    <SourceForm/>
                ) : (
                    <>
                        <MapFragment
                            mapFragmentPosition={WATER_SOURCE_MAP_BOUNDARIES}
                            markerLocations={entries}
                            startLocation={START_LOCATION}
                            setCarouselId={setCarouselId}
                            carouselId={carouselId}
                        />
                        <View style={styles.carouselContainer}>
                            <WaterCarousel entries={entries} carouselId={carouselId} setCarouselId={setCarouselId}/>
                        </View>
                    </>
                )
            }
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
    roundButton: {
        position: 'absolute',
        bottom: 280,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
    },
});