import React, { PropsWithChildren, ReactElement, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  Image,
  Modal,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import {
  GestureHandlerRootView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { View, Text } from "react-native";
import { auth } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme() ?? "dark";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const navigation = useNavigation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("Logged in successfully");
      setLoading(false);
      setModalVisible(false);
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
    <GestureHandlerRootView>
      <ThemedView style={styles.container}>
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme] },
              headerAnimatedStyle,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Image
              source={headerImage.props.source}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <ThemedText type="title" style={styles.headerText}>
              Aqua Guard
            </ThemedText>
            <ThemedView style={styles.headerButtons}>
              <Ionicons
                name="notifications"
                size={20}
                color="#fff"
                style={styles.notification}
              />
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={require("@/assets/images/avatar.jpg")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </ThemedView>
          </Animated.View>

          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.ScrollView>
      </ThemedView>
      <KeyboardAvoidingView behavior="padding">
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalView}>
              <Text style={styles.title}>Login</Text>
              <TextInput
                value={email}
                style={styles.input}
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
              {/* <ThemedView style={styles.loginBtns}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </ThemedView> */}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loginBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  header: {
    height: 120,
    borderRadius: 30,
  },
  headerText: {
    position: "absolute",
    top: 66,
    left: 16,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    color: "#fff",
  },
  headerButtons: {
    backgroundColor: "transparent",
    gap: 10,
    position: "absolute",
    right: 7,
    top: 60,
    marginRight: 16,
    marginBottom: 16,
    flexDirection: "row",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 32,
  },
  notification: {
    padding: 9,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  closeText: {
    color: "#007bff",
    marginTop: 15,
    fontSize: 16,
  },
});
