import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { WaterSourceLocationEntry } from "@/types";
import { Ionicons } from "@expo/vector-icons";

const window = Dimensions.get("window");
const PAGE_WIDTH = window.width;

interface WaterCarouselData {
  entries: WaterSourceLocationEntry[];
  carouselId: string;
  likes: number;
  dislikes: number;
  setCarouselId?: (id: string) => void;
}

function WaterCarousel({
  entries,
  carouselId,
  setCarouselId,
}: WaterCarouselData) {
  const progressValue = useSharedValue<number>(0);
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const [reactions, setReactions] = useState<{
    [key: string]: { likes: number; dislikes: number };
  }>({});

  useEffect(() => {
    const initialReactions = entries.reduce((acc, entry) => {
      acc[entry.id] = {
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 50),
      };
      return acc;
    }, {});
    setReactions(initialReactions);
  }, [entries]);

  const handleCarouselIdChange = (id: string) => {
    const entryIndex = entries.findIndex((entry) => entry.id === id);
    if (entryIndex !== -1 && carouselRef.current) {
      carouselRef.current.scrollTo({
        index: entryIndex,
        animated: true,
      });
    }
  };

  const handleLike = (id: string) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [id]: {
        ...prevReactions[id],
        likes: prevReactions[id].likes + 1,
      },
    }));
  };

  const handleDislike = (id: string) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [id]: {
        ...prevReactions[id],
        dislikes: prevReactions[id].dislikes - 1,
      },
    }));
  };

  useEffect(() => {
    handleCarouselIdChange(carouselId);
  }, [carouselId]);

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
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        data={entries}
        renderItem={({ item }) => (
          <View style={waterCarouselStyleSheet.cardView}>
            <View style={waterCarouselStyleSheet.titleContainer}>
              <Text style={waterCarouselStyleSheet.cardTitle}>
                {item.title}
              </Text>
              <TouchableOpacity
                style={waterCarouselStyleSheet.heartBtn}
                onPress={() => handleLike(item.id)}
              >
                <Ionicons name="heart" size={20} color="white" />
                <Text style={waterCarouselStyleSheet.reactionBtnText}>
                  {reactions[item.id]?.likes ?? 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={waterCarouselStyleSheet.dislikeBtn}
                onPress={() => handleDislike(item.id)}
              >
                <Ionicons name="thumbs-down" size={20} color="white" />
                <Text style={waterCarouselStyleSheet.reactionBtnText}>
                  {reactions[item.id]?.dislikes ?? 0}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={waterCarouselStyleSheet.imageScrollView}
            >
              {(item.images ?? []).map((imageUri, index) => (
                <Image
                  key={index}
                  source={
                    imageUri !== ""
                      ? { uri: imageUri }
                      : require("@/assets/images/dummy_location.jpg")
                  }
                  style={waterCarouselStyleSheet.cardImage}
                  resizeMode="contain"
                  onError={(error) =>
                    console.log("Error loading image: ", error)
                  }
                />
              ))}
            </ScrollView>
            <Text style={waterCarouselStyleSheet.description}>
              {item.description}
            </Text>
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

const waterCarouselStyleSheet = StyleSheet.create({
  mainView: {
    alignItems: "center",
  },
  heartBtn: {
    color: "white",
    fontSize: 20,
    marginRight: 5,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 25,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    textAlign: "center",
  },
  reactionBtnText: {
    color: "white",
    fontSize: 20,
  },
  dislikeBtn: {
    flexDirection: "row",
    gap: 5,
    color: "white",
    fontSize: 20,
    marginRight: 5,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 25,
    alignItems: "center",
    textAlign: "center",
  },
  cardView: {
    padding: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    alignItems: "center",
    height: 300,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  cardTitle: {
    fontSize: 40,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "white",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  cardImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  imageScrollView: {
    flexDirection: "row",
    marginVertical: 10,
  },
  description: {
    fontSize: 25,
    color: "white",
  },
});

export default WaterCarousel;
