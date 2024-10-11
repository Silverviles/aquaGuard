import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface CardProps {
  imageSource: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ imageSource, title, description }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageSource }}
        style={styles.image}
        onError={(error) => console.log("Image Load Error: ", error)}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#243642",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: "100%", // Set to the full width of the parent container
    height: 150, // Fixed height
    borderRadius: 10,
    resizeMode: "cover", // Ensures the image scales properly
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default Card;
