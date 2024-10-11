import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/config/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // User state and loading state should be declared here
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once user is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync(); // Hide splash screen only when fonts are loaded and loading is false
    }
  }, [loaded, loading]);

  // Early return while loading
  if (!loaded || loading) {
    return null; // Don't render anything until fonts are loaded and user state is determined
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <Stack>
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            <Stack.Screen name="report-form" options={{ headerShown: false }} />
            {/* Navigate to login-form if user is null, else navigate to (tabs) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </KeyboardAvoidingView>
      </ThemeProvider>
    </AuthProvider>
  );
}
