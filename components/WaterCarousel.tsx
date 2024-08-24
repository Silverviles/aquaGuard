import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useSharedValue} from "react-native-reanimated";

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;

interface WaterCarouselProps {
    entries: { title: string; description: string }[];
}

function WaterCarousel({entries}: WaterCarouselProps) {
    const progressValue = useSharedValue<number>(0);

    return (
        <View style={{alignItems: 'center'}}>
            <Carousel
                vertical={false}
                width={PAGE_WIDTH}
                height={PAGE_WIDTH}
                loop
                pagingEnabled={true}
                snapEnabled={true}
                autoPlay={false}
                onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
                mode="parallax"
                data={entries}
                renderItem={({item}) => (
                    <View style={{padding: 20, backgroundColor: 'white', borderRadius: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                        <Text>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
}

export default WaterCarousel;