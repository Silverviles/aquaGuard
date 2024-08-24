import MapView, {Marker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {LocationEntry, MapDisplayPosition} from "@/types";

interface MapFragmentData {
    mapFragmentPosition: MapDisplayPosition;
    markerLocations: LocationEntry[];
    startLocation: LocationEntry;
    focusedLocation?: Region;
}

const MapFragment = ({
                         mapFragmentPosition,
                         markerLocations,
                         startLocation,
                         focusedLocation
                     }: MapFragmentData): React.JSX.Element => {
    const {left, right, top, bottom} = mapFragmentPosition;
    const mapRef = useRef<MapView>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMarkers, setFilteredMarkers] = useState<LocationEntry[]>([]);

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

    const mapFragmentStyleSheet = StyleSheet.create({
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
        <View style={mapFragmentStyleSheet.container}>
            <TextInput
                style={mapFragmentStyleSheet.searchBar}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {filteredMarkers.length > 0 && (
                <FlatList
                    style={mapFragmentStyleSheet.dropdown}
                    data={filteredMarkers}
                    keyExtractor={(item) => item.title}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={mapFragmentStyleSheet.dropdownItem}
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
                style={mapFragmentStyleSheet.map}
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