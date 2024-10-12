import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";

interface CardProps {
  imageSource: string;
  title: string;
  description: string;
  district?: string;
  city?: string;
}

const Card: React.FC<CardProps> = ({
  imageSource,
  title,
  description,
  district,
  city,
}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageSource }}
        style={styles.image}
        onError={(error) => console.log("Image Load Error: ", error)}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View
        style={{ height: 1, backgroundColor: "#666", marginVertical: 10 }}
      />

      <ThemedView style={styles.location}>
        <Text style={styles.locationText}> {district}</Text>
        <Text style={styles.locationText}>| </Text>
        <Text style={styles.locationText}>{city} </Text>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#121212",
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Increased shadow offset height
    shadowOpacity: 0.9, // Increased shadow opacity
    shadowRadius: 4, // Increased shadow radius
    elevation: 3, // Increased elevation for Android
  },
  location: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    marginTop: 5,
    flexDirection: "row",
    gap: 5,
  },
  locationText: {
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    justifyContent: "center",
    textAlign: "left",
  },
});

export default Card;
