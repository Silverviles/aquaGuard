import React, {useEffect} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useSharedValue} from "react-native-reanimated";
import {WaterSourceLocationEntry} from "@/types";

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;

interface WaterCarouselData {
    entries: WaterSourceLocationEntry[];
    carouselId: string;
    setCarouselId?: (id: string) => void;
}

function WaterCarousel({entries, carouselId, setCarouselId}: WaterCarouselData) {
    const progressValue = useSharedValue<number>(0);
    const carouselRef = React.useRef<ICarouselInstance>(null);

    const handleCarouselIdChange = (id: string) => {
        const entryIndex = entries.findIndex(entry => entry.id === id);
        if (entryIndex !== -1 && carouselRef.current) {
            carouselRef.current.scrollTo({
                index: entryIndex,
                animated: true
            });
        }
    }

    useEffect(() => {
        handleCarouselIdChange(carouselId);
    }, [carouselId]);

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
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        cardTitle: {
            fontSize: 40,
            fontWeight: 'bold',
            flex: 1
        },
        button: {
            backgroundColor: 'blue',
            borderRadius: 5,
            padding: 5,
            marginLeft: 10
        },
        buttonText: {
            color: 'white',
            fontSize: 12
        },
        cardImage: {
            width: 100,
            height: 100,
            marginVertical: 10
        },
        imageScrollView: {
            flexDirection: 'row',
            marginVertical: 10
        },
        description: {
            fontSize: 25,
            textAlign: 'justify'
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
                        <View style={waterCarouselStyleSheet.titleContainer}>
                            <Text style={waterCarouselStyleSheet.cardTitle}>{item.title}</Text>
                            <TouchableOpacity style={waterCarouselStyleSheet.button}
                                              onPress={() => console.log('Button 1 pressed')}>
                                <Text style={waterCarouselStyleSheet.buttonText}>B1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={waterCarouselStyleSheet.button}
                                              onPress={() => console.log('Button 2 pressed')}>
                                <Text style={waterCarouselStyleSheet.buttonText}>B2</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                    style={waterCarouselStyleSheet.imageScrollView}>
                            {(item.images ?? []).map((imageUri, index) => (
                                <Image
                                    key={index}
                                    source={imageUri !== '' ? { uri: imageUri } : require('@/assets/images/dummy_location.jpg')}
                                    style={waterCarouselStyleSheet.cardImage}
                                    resizeMode="contain"
                                    onError={(error) => console.log('Error loading image: ', error)}
                                />
                            ))}
                        </ScrollView>
                        <Text style={waterCarouselStyleSheet.description}>{item.description}</Text>
                    </View>
                )}
                onScrollEnd={(index) => {
                    if (setCarouselId) {
                        setCarouselId(entries[index].id);
                    }
                }}
            />
        </View>
    );
}

export default WaterCarousel;