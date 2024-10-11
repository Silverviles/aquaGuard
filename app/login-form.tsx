import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  KeyboardAvoidingView,
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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth } from "../config/firebaseConfig";

const LoginForm = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("Logged in successfully");
      setLoading(false);
    } catch (error) {
      alert("Logged in Failed");
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert("Sign in Successfully");
      console.log(response);
    } catch (error) {
      alert("Sign in Failed");
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

            <KeyboardAvoidingView behavior="padding">
              <TextInput
                style={styles.input}
                value={email}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                value={password}
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
              />

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <ThemedView style={styles.loginBtns}>
                    <Button title="Login" onPress={signIn} />
                    <Button title="Create Account" onPress={signUp} />
                  </ThemedView>
                </>
              )}
            </KeyboardAvoidingView>
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
  loginBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 20,
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
