import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WaterCarousel from '@/components/WaterCarousel';
import MapFragment from "@/components/MapFragment";
import {START_LOCATION, WATER_SOURCE_MAP_BOUNDARIES} from "@/constants/StaticValues";
import SourceForm from "@/components/SourceForm";
import {WaterSourceLocationEntry} from "@/types";
import {getWaterSourceData} from "@/config/water_source";

export default () => {
    const [carouselId, setCarouselId] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formCoordinates, setFormCoordinates] = useState<{
        latitude: number,
        longitude: number
    } | undefined>(undefined);
    const [locationEntries, setLocationEntries] = useState<WaterSourceLocationEntry[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getWaterSourceData();
            console.log(data);
            const formattedData: WaterSourceLocationEntry[] = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: item.latitudeDelta,
                longitudeDelta: item.longitudeDelta,
                images: item.images,
                upVotes: item.upVotes,
                downVotes: item.downVotes,
            }));
            setLocationEntries(formattedData);
        };
        fetchData();
    }, [showForm]);

    const handleLongPress = (coords: { latitude: number, longitude: number }) => {
        setFormCoordinates(coords);
        setShowForm(true);
    };

    return (
        <View style={styles.container}>
            {
                !showForm && (
                    <TouchableOpacity style={styles.roundButton} onPress={() => setShowForm(true)}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                )
            }
            {
                <>
                    <MapFragment
                        mapFragmentPosition={WATER_SOURCE_MAP_BOUNDARIES}
                        markerLocations={locationEntries}
                        startLocation={START_LOCATION}
                        setCarouselId={setCarouselId}
                        carouselId={carouselId}
                        onLongPress={handleLongPress}
                    />
                    <View style={styles.carouselContainer}>
                        <WaterCarousel entries={locationEntries} carouselId={carouselId} setCarouselId={setCarouselId}/>
                    </View>
                    {showForm && (
                        <View style={styles.formContainer}>
                            <SourceForm setShowForm={setShowForm} initialCoordinates={formCoordinates}/>
                        </View>
                    )}
                </>
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
    formContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: add a semi-transparent background
        zIndex: 10,
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