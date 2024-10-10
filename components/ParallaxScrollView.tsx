import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme, Image } from "react-native";
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
  const colorScheme = useColorScheme() ?? "dark";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

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

  return (
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
            <Image
              source={require("@/assets/images/avatar.jpg")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </ThemedView>
        </Animated.View>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
        ></Animated.ScrollView>

        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
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
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    right: 7,
    top: 60,
    backgroundColor: "rgba(0, 0, 0, 0)",
    marginRight: 16,
    marginBottom: 16,
    gap: 16,
    flexDirection: "row",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
  notification: {
    padding: 9,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
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
});
