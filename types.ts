export interface LocationEntry {
    id: string,
    title: string,
    description: string,
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
    image?: string,
}

export interface MapDisplayPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
