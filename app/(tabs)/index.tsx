import React, { useState } from "react";
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

const posts = [
  {
    image:
      "https://img.freepik.com/free-vector/marine-underwater-flora-fauna_1284-37132.jpg?t=st=1728563323~exp=1728566923~hmac=f1266d5c8f36274e72a4449db509884712bd7cd645d9159ace9b4f4d2b0399f5&w=1060",
    heading: "heading 1",
    description:
      "paraparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparapara",
  },
  {
    image:
      "https://img.freepik.com/free-vector/marine-underwater-flora-fauna_1284-37132.jpg?t=st=1728563323~exp=1728566923~hmac=f1266d5c8f36274e72a4449db509884712bd7cd645d9159ace9b4f4d2b0399f5&w=1060",
    heading: "heading 2",
    description:
      "paraparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparapara",
  },
  {
    image:
      "https://img.freepik.com/free-vector/marine-underwater-flora-fauna_1284-37132.jpg?t=st=1728563323~exp=1728566923~hmac=f1266d5c8f36274e72a4449db509884712bd7cd645d9159ace9b4f4d2b0399f5&w=1060",
    heading: "heading 3",
    description:
      "paraparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparaparapara",
  },
];

export default function HomeScreen() {
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

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#151718", dark: "#151718" }}
        headerImage={
          <Image source={require("@/assets/images/header-bg.jpg")} />
        }
      >
        <ScrollView>
          {posts.map((post, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(post)}>
              <Card
                description={post.description}
                imageSource={post.image}
                title={post.heading}
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
        onPress={() => {
          /* handle button press */
        }}
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
