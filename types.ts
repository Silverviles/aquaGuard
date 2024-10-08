export interface WaterSourceLocationEntry {
    id: string,
    title: string,
    description: string,
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
    images?: string[],
}

export interface MapDisplayPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
