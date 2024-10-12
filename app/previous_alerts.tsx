import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons for the delete icon

const initialAlerts = [
  { id: 1, message: "Water contamination in Kaduwela.", date: "2024-10-01" },
  {
    id: 2,
    message: "Pipeline leakage detected in Weliwita road.",
    date: "2024-09-29",
  },
  { id: 3, message: "Water supply disruption in Malabe.", date: "2024-09-25" },
  {
    id: 4,
    message: "Pipeline leakage detected in Pittugala.",
    date: "2024-08-23",
  },
  {
    id: 5,
    message: "Water supply disruption in Kothalawala.",
    date: "2024-08-02",
  }, // The alert that wasn't showing
];

export default function PreviousAlertsScreen() {
  const [alerts, setAlerts] = useState(initialAlerts); // Use state to handle alerts list

  const navigation = useNavigation();
  const deleteAlert = (id: number) => {
    // Function to delete an alert
    const updatedAlerts = alerts.filter((alert) => alert.id !== id);
    setAlerts(updatedAlerts);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#151718", dark: "#151718" }}
      headerImage={<Image source={require("@/assets/images/header-bg.jpg")} />}
    >
      <ScrollView>
        <ThemedView
          style={{
            flexDirection: "row",
            gap: 30,
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("alert")}>
            <Ionicons name="arrow-back" size={24} color="#ADD8E6" />
          </TouchableOpacity>
          <Text style={styles.header}>Previous Alerts</Text>
        </ThemedView>
        {alerts.map((alert) => (
          <View key={alert.id} style={styles.alertContainer}>
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertDate}>{alert.date}</Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteAlert(alert.id)}
              style={styles.deleteButton}
            >
              {/* Wrap the Icon in a Text component */}
              <Text>
                <Icon name="trash-outline" size={24} color="#FF6347" />{" "}
                {/* Trash Icon */}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView content can grow and is scrollable
    padding: 20,
    borderWidth: 2,
    borderColor: "red",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ADD8E6",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Adds a subtle shadow
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  alertContainer: {
    flexDirection: "row", // Align delete button and alert message in a row
    justifyContent: "space-between",
    alignItems: "center", // Align vertically
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#121212",
    borderRadius: 12,
    borderColor: "#333",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3, // Adds shadow on Android
  },
  alertContent: {
    flex: 1, // Make the text container fill available space
  },
  alertMessage: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  alertDate: {
    fontSize: 14,
    color: "#888888",
    marginTop: 8,
  },
  deleteButton: {
    padding: 5,
  },
});
