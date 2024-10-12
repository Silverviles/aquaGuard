import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { WaterSourceLocationEntry } from "@/types";
import { insertUpdateWaterSourceData } from "@/config/water_source";
import { storage } from "@/config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { Colors } from "@/constants/Colors";

interface SourceFormProps {
  setShowForm?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  initialCoordinates?: { latitude: number; longitude: number };
}

const SourceForm = ({ setShowForm, initialCoordinates }: SourceFormProps) => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(
    initialCoordinates?.latitude.toString() || ""
  );
  const [longitude, setLongitude] = useState(
    initialCoordinates?.longitude.toString() || ""
  );
  const [description, setDescription] = useState("");
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

    const waterSource: WaterSourceLocationEntry = {
      id: Date.now().toString(), // Generate a unique ID
      title: name,
      description: description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      latitudeDelta: 0.0922, // Default value, adjust as needed
      longitudeDelta: 0.0421, // Default value, adjust as needed
      images: imageUrls,
      upVotes: 0,
      downVotes: 0,
    };

    insertUpdateWaterSourceData(waterSource);
    if (setShowForm) {
      setShowForm(false);
    }
    console.log({ name, latitude, longitude, description, photos });
  };

  const closeForm = () => {
    if (setShowForm) {
      setShowForm(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={closeForm}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add Water Source</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
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
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText} onPress={pickImage}>
          Attach Photo
        </Text>
      </TouchableOpacity>
      <View style={styles.photosContainer}>
        {photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.photo} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    padding: 20,
    backgroundColor: Colors.light.background,
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 100,
    textAlign: "center",
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
  submitButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default SourceForm;
