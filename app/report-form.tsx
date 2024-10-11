import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { WaterReportEntry } from "@/types";
import { storage } from "@/config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { insertUpateWaterReportData } from "@/config/water_report";

interface ReportFormProps {
  setShowForm?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  initialCoordinates?: { latitude: number; longitude: number };
}

const ReportForm = ({ setShowForm }: ReportFormProps) => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("option1");

  const [description, setDescription] = useState("");
  const [town, setTown] = useState("");
  const [district, setDistrict] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `images/${Date.now()}_${Math.random().toString(36).substring(7)}`
    );
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    const imageUrls = await Promise.all(
      photos.map((photo) => uploadImage(photo))
    );

    const waterReport: WaterReportEntry = {
      id: Date.now().toString(), // Generate a unique ID
      title: selectedOption,
      district: district,
      town: town,
      description: description,
      images: imageUrls,
    };

    insertUpateWaterReportData(waterReport);
    if (setShowForm) {
      setShowForm(false);
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
            <Text style={styles.title}>Make A Report</Text>
          </ThemedView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={styles.card}
          >
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Enter What you reporting about
              </Text>
              <Picker
                selectedValue={selectedOption}
                onValueChange={(itemValue) => setSelectedOption(itemValue)}
                style={{
                  height: 50,
                  width: "100%",
                  marginBottom: 5,
                }}
              >
                <Picker.Item
                  label="Contaminated or Polluted Water"
                  value="Contaminated or Polluted Water"
                />
                <Picker.Item
                  label="Unusual Taste or Smell"
                  value="Unusual Taste or Smell"
                />
                <Picker.Item label="Pipe Leakage" value="Pipe Leakage" />
                <Picker.Item
                  label="Overflows or Blockages"
                  value="Overflows or Blockages"
                />
                <Picker.Item
                  label="Broken or Damaged Pipes"
                  value="Broken or Damaged Pipes"
                />
                <Picker.Item
                  label="Health-Related Issue"
                  value="Health-Related Issue"
                />
                <Picker.Item label="Other" value="Other" />
              </Picker>
              <TextInput
                style={styles.input}
                placeholder="District"
                value={district}
                onChangeText={setDistrict}
              />
              <TextInput
                style={styles.input}
                placeholder="Town"
                value={town}
                onChangeText={setTown}
              />

              <TextInput
                style={[styles.input, styles.multiInput]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: "blue" }]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={pickImage}>
                <Text style={styles.submitButtonText}>Attach Photo</Text>
              </TouchableOpacity>
              <View style={styles.photosContainer}>
                {photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photo}
                  />
                ))}
              </View>
            </View>
          </KeyboardAvoidingView>
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

export default ReportForm;
