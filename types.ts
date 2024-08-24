// types.ts
import {Region} from "react-native-maps";

export interface LocationEntry {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
    image?: string;
}

export interface MapDisplayPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface MapFragmentData {
    mapFragmentPosition: MapDisplayPosition;
    markerLocations: LocationEntry[];
    startLocation: LocationEntry;
    focusedLocation?: Region;
}