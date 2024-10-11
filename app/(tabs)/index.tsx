import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Text,
  ViewComponent,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import Card from "@/components/home/card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { database } from "@/config/firebaseConfig";
import { get, onValue, ref, set } from "@firebase/database";
import AppNavigator from '@/components/navigation/StackNavigator';


export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedPost, setSelectedPost] = useState<{
    image: string;
    heading: string;
    description: string;
  } | null>(null);

  const handleCardPress = (post: {
    image: string;
    heading: string;
    description: string;
  }) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const [waterPostData, setWaterPostData] = useState<any[] | null>(null);

  async function getAllWaterSourceData() {
    const waterSourceRef = ref(database, "water_report");

    // Listen for changes in the data
    onValue(
      waterSourceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => {
            const firstImage =
              data[key].images && data[key].images.length > 0
                ? data[key].images[0]
                : "default_image_url"; // Fallback image if no image is available
            return {
              id: key,
              ...data[key],
              image: firstImage,
            };
          });
          setWaterPostData(formattedData); // Set the data directly as it has the correct structure
        } else {
          console.log("No data available.");
          setWaterPostData([]); // Set to an empty array if no data
        }
      },
      (error) => {
        console.error("Error getting data: ", error);
      }
    );
  }

  useEffect(() => {
    getAllWaterSourceData();
  }, []);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#151718", dark: "#151718" }}
        headerImage={
          <Image source={require("@/assets/images/header-bg.jpg")} />
        }
      >
        <ScrollView>
          {waterPostData?.map((post, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                handleCardPress({
                  image: post.image,
                  heading: post.title,
                  description: post.description,
                })
              }
            >
              <Card
                imageSource={post.image}
                title={post.title}
                description={post.description}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Modal for Enlarged Card */}
        {selectedPost && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={!!selectedPost}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: selectedPost.image }}
                  style={styles.enlargedImage}
                />
                <Text style={styles.enlargedTitle}>{selectedPost.heading}</Text>
                <Text style={styles.enlargedDescription}>
                  {selectedPost.description}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ParallaxScrollView>


      {/* Floating button */}
      <TouchableOpacity
        style={styles.floatingButton}
        //ignore this error guys it works :)
        onPress={() => navigation.navigate("report-form")}
      >
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>

    </>

  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 50,
    right: 50,
    zIndex: 50,
    backgroundColor: "#7EACB5",
    borderRadius: 25,
    padding: 15,
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  enlargedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  enlargedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  enlargedDescription: {
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});