import React, {useEffect} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useSharedValue} from "react-native-reanimated";
import {LocationEntry} from "@/types";

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;

interface WaterCarouselData {
    entries: LocationEntry[];
    carouselIndex: number;
}

function WaterCarousel({entries, carouselIndex}: WaterCarouselData) {
    const progressValue = useSharedValue<number>(0);
    const carouselRef = React.useRef<ICarouselInstance>(null);

    const handleCarouselIndexChange = (index: number) => {
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                index: index,
                animated: true
            });
        }
    }

    useEffect(() => {
        handleCarouselIndexChange(carouselIndex);
    }, [carouselIndex]);

    const waterCarouselStyleSheet = StyleSheet.create({
        mainView: {
            alignItems: 'center'
        },
        cardView: {
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            alignItems: 'center',
            height: 300
        },
        cardTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'flex-start'
        },
        cardImage: {
            width: 100,
            height: 100,
            marginVertical: 10
        }
    });

    return (
        <View style={waterCarouselStyleSheet.mainView}>
            <Carousel
                ref={carouselRef}
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
                    <View style={waterCarouselStyleSheet.cardView}>
                        <Text style={{}}>{item.title}</Text>
                        <Image
                            source={item.image != '' ? {uri: item.image} : require('@/assets/images/dummy_location.jpg')}
                            style={waterCarouselStyleSheet.cardImage}
                            resizeMode="contain"
                            onError={(error) => console.log('Error loading image: ', error)}
                        />
                        <Text>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
}

export default WaterCarousel;