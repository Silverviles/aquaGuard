import MapView, {Marker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";

interface MapDisplayPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

interface MarkerLocation {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
    title: string;
}

interface MapFragmentProps {
    location: MapDisplayPosition;
    markerLocations: MarkerLocation[];
    startLocation: MarkerLocation;
    focusedLocation?: Region;
}

const MapFragment = ({
                         location,
                         markerLocations,
                         startLocation,
                         focusedLocation
                     }: MapFragmentProps): React.JSX.Element => {
    const {left, right, top, bottom} = location;
    const mapRef = useRef<MapView>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMarkers, setFilteredMarkers] = useState<MarkerLocation[]>([]);

    useEffect(() => {
        if (focusedLocation && mapRef.current) {
            mapRef.current.animateToRegion(focusedLocation, 1000);
        }
    }, [focusedLocation]);

    useEffect(() => {
        if (searchQuery.length > 3) {
            setFilteredMarkers(markerLocations.filter(marker =>
                marker.title.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        } else {
            setFilteredMarkers([]);
        }
    }, [searchQuery, markerLocations]);

    useEffect(() => {
        const exactMatch = markerLocations.find(marker => marker.title.toLowerCase() === searchQuery.toLowerCase());
        if (exactMatch && mapRef.current) {
            const newRegion = {
                latitude: exactMatch.latitude,
                longitude: exactMatch.longitude,
                latitudeDelta: exactMatch.latitudeDelta,
                longitudeDelta: exactMatch.longitudeDelta,
            };
            mapRef.current.animateToRegion(newRegion, 1000);
            setFilteredMarkers([]);
        }
    }, [searchQuery, markerLocations]);

    const dynamicStyles = StyleSheet.create({
        container: {
            position: 'absolute',
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            justifyContent: 'flex-end',
            alignItems: 'center',
            overflow: 'hidden'
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        searchBar: {
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 10,
            zIndex: 1,
        },
        dropdown: {
            position: 'absolute',
            top: 50,
            left: 10,
            right: 10,
            backgroundColor: 'white',
            borderRadius: 5,
            zIndex: 1,
            maxHeight: 200,
        },
        dropdownItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
        }
    });

    return (
        <View style={dynamicStyles.container}>
            <TextInput
                style={dynamicStyles.searchBar}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {filteredMarkers.length > 0 && (
                <FlatList
                    style={dynamicStyles.dropdown}
                    data={filteredMarkers}
                    keyExtractor={(item) => item.title}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={dynamicStyles.dropdownItem}
                            onPress={() => {
                                const newRegion = {
                                    latitude: item.latitude,
                                    longitude: item.longitude,
                                    latitudeDelta: item.latitudeDelta,
                                    longitudeDelta: item.longitudeDelta,
                                };
                                mapRef.current?.animateToRegion(newRegion, 1000);
                                setSearchQuery(item.title);
                                setFilteredMarkers([]);
                            }}
                        >
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={dynamicStyles.map}
                region={{
                    latitude: startLocation.latitude,
                    longitude: startLocation.longitude,
                    latitudeDelta: startLocation.latitudeDelta,
                    longitudeDelta: startLocation.longitudeDelta,
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
        </View>
    );
};

export default MapFragment;