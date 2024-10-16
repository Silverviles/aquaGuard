import React, {useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Image, StatusBar, Platform, Alert, BackHandler } from "react-native";
import { Picker } from '@react-native-picker/picker'; // For dropdown
import * as ImagePicker from 'expo-image-picker'; // For image upload
import { database, storage } from "@/config/firebaseConfig";
import {push, ref, set} from "@firebase/database";
import {ref as stRef, uploadBytes, getDownloadURL} from "firebase/storage";
import { useAuth } from "@/config/AuthContext";
import {Feather, Fontisto } from "@expo/vector-icons";

interface DiscussionFormProps {
    closeDiscussionForm: () => void;
}

const DiscussionForm: React.FC<DiscussionFormProps> = ({closeDiscussionForm}) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState("");
    const [author, setAuthor] = useState('unknown');
    const { user } = useAuth();

    useEffect(() => {
        if (user && user!.email) {
            let name = user!.email!.split('@')[0];
            setAuthor(name);
        }
    }, []);

    // Image picker function
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImageUri(result.assets?.[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = stRef(storage, `images/${Date.now()}_${Math.random().toString(36).substring(7)}`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
    };

    // Submit handler function (to send data to Firebase)
    const handleSubmit = async () => {
        if (title.trim()==""){
            Alert.alert("Enter a title", "Title cannot be empty");
            return;
        }
        if (category==""){
            Alert.alert("Please Select a Category");
            return;
        }
        let imageUrl = null;
        if (imageUri) {
            imageUrl = await uploadImage(imageUri);
        }

        const newDiscussion = {
            title,
            category,
            content,
            image: imageUrl,
            likes: 0,
            comments: [],
            author
        };

        // Get a reference to the discussions node
        const discussionsRef = ref(database, "discussions");

        // Push the new discussion and get the auto-generated key
        const newDiscussionRef = push(discussionsRef);

        // Save the discussion with the generated key
        set(newDiscussionRef, newDiscussion)
            .then(() => {
                // Reset the form or handle success
                setTitle("");
                setCategory("");
                setContent("");
                setImageUri("");
                closeDiscussionForm();
            })
            .catch((error) => {
                console.error("Error saving discussion:", error);
            });

    };

    useEffect(() => {
        // Function to handle the back press
        const backAction = () => {
            closeDiscussionForm();
            return true; // Returning true overrides the default back action
        };

        // Add event listener for back press
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // Cleanup the event listener when the component unmounts
        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a"/>
            {/* Header with Close (X) and Submit (Check) */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={closeDiscussionForm}
                >
                    <Fontisto name="close-a" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>New Discussion</Text>
                <TouchableOpacity onPress={handleSubmit}>
                    <Feather name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Title Input */}
            <TextInput
                style={styles.input}
                placeholder="Add Title"
                placeholderTextColor='white'
                value={title}
                onChangeText={setTitle}
            />

            {/* Category Picker */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    <Picker.Item label="Select Category" value=""/>
                    <Picker.Item label="Water Quality" value="Water Quality"/>
                    <Picker.Item label="Sanitation" value="Sanitation"/>
                    <Picker.Item label="Education" value="Education"/>
                    <Picker.Item label="Climate" value="Climate"/>
                    <Picker.Item label="Health" value="Health"/>
                    <Picker.Item label="Q&A" value="Q&A"/>
                    <Picker.Item label="Other" value="Other"/>
                </Picker>
            </View>

            {/* Image Upload Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            {imageUri && (
                <Image source={{uri: imageUri}} style={styles.imagePreview}/>
            )}

            {/* Body Text Input */}
            <TextInput
                style={[styles.input, styles.bodyTextInput]}
                placeholder="Body text (Optional)"
                placeholderTextColor='white'
                value={content}
                onChangeText={setContent}
                multiline
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#1a1a1a", // Dark background as per design
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 12
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelText: {
        fontSize: 24,
        color: '#f00',
        fontWeight: 'bold',
    },
    submitText: {
        fontSize: 24,
        color: '#0f0',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: "#333", // Dark background for inputs
        color: "white", // White text
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    pickerContainer: {
        backgroundColor: "#333",
        borderRadius: 10,
        marginBottom: 15,
    },
    picker: {
        color: "white", // White text for dropdown
    },
    uploadButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333", // Dark button background
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    uploadText: {
        color: "white",
        //marginLeft: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 15,
    },
    bodyTextInput: {
        height: 100,
        textAlignVertical: 'top', // For multiline input
    },
});

export default DiscussionForm;

