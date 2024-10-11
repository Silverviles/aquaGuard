import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <GestureHandlerRootView style={styles.gestureHandlerContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#151718", dark: "#151718" }}
        headerImage={
          <Image source={require("@/assets/images/header-bg.jpg")} />
        }
      >
        <ThemedView>
          <ThemedView style={styles.header}>
            <TouchableOpacity
              style={styles.floatingButton}
              //ignore this error guys it works :)
              onPress={() => navigation.navigate("index")}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Login To Our App</Text>
          </ThemedView>

          <View style={styles.card}>
            {/* <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Enter What you reporting about
            </Text> */}

            <TextInput
              style={styles.input}
              placeholder="UseName"
              value={""}
              //   onChangeText={''}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              //   value={latitude}
              //   onChangeText={setLatitude}
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: "blue" }]}
              //   onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ParallaxScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -15,
    marginBottom: 15,
    justifyContent: "space-between",
    backgroundColor: "#151718",
  },
  bottomImage: {
    width: "100%",
    height: 130,
  },
  gestureHandlerContainer: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 150,
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 50,
    color: "black",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 50,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  multiInput: {
    textAlignVertical: "top",
    height: 100,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "grey",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  floatingButton: {
    padding: 10,
    marginTop: -50,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default LoginForm;
