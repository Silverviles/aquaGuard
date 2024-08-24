import MapFragment from "@/components/MapFragment";

const dummyLocations = [
    {latitude: 37.7749, longitude: -122.4194, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "San Francisco"},
    {latitude: 34.0522, longitude: -118.2437, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "Los Angeles"},
    {latitude: 40.7128, longitude: -74.0060, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "New York"},
    {latitude: 41.8781, longitude: -87.6298, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "Chicago"},
    {latitude: 29.7604, longitude: -95.3698, latitudeDelta: 0.0922, longitudeDelta: 0.0421, title: "Houston"}
];

export default () => (
    <MapFragment
        location={{left: 0, right: 0, top: 38, bottom: 0}}
        markerLocations={dummyLocations}
        startLocation={{
            latitude: 6.9143498,
            longitude: 79.972684,
            latitudeDelta: 0.05,
            longitudeDelta: 0.0421,
            title: "Start"
        }}
    />
);