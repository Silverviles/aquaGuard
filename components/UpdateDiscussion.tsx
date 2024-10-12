import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Platform, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker'; // For dropdown
import * as ImagePicker from 'expo-image-picker'; // For image upload
import { database, storage } from "@/config/firebaseConfig";
import { ref, set } from "@firebase/database";
import {ref as stRef, uploadBytes, getDownloadURL} from "firebase/storage";
import { useAuth } from "@/config/AuthContext";
import { update } from "firebase/database";

interface Discussion {
    id: string,
    title: string,
    author: string,
    content: string,
    likes: number,
    comments: string[],
    image: string,
    category: string
}

interface UpdatePageProps {
    discussion: Discussion; // Pass the discussion data as a prop
    closeUpdatePage: () => void;
}

const UpdatePage: React.FC<UpdatePageProps> = ({ discussion, closeUpdatePage }) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState("");
    const [author, setAuthor] = useState('unknown');
    const { user } = useAuth();

    useEffect(() => {
        console.log(discussion.image);
        if (user && user.email) {
            let name = user.email.split('@')[0];
            setAuthor(name);
        }

        // Populate state with discussion data
        setTitle(discussion.title);
        setCategory(discussion.category);
        setContent(discussion.content);
        setImageUri(discussion.image || "");
    }, [discussion]);

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
    const handleUpdate = async () => {
        if (title.trim() === "") {
            Alert.alert("Enter a title", "Title cannot be empty");
            return;
        }
        if (category === "") {
            Alert.alert("Please Select a Category");
            return;
        }

        let imageUrl = null;
        if (imageUri) {
            imageUrl = await uploadImage(imageUri);
        } else {
            imageUrl = discussion.image??null; // Keep the existing image if no new image is selected
        }

        const updatedDiscussion = {
            title,
            category,
            content,
            image: imageUrl
        };

        // Update the discussion in Firebase
        const discussionRef = ref(database, `discussions/${discussion.id}`);
        update(discussionRef, updatedDiscussion)
            .then(() => {
                closeUpdatePage();
            })
            .catch((error) => {
                console.error("Error updating discussion:", error);
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
            {/* Header with Close (X) and Submit (Check) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={closeUpdatePage}>
                    <Text style={styles.cancelText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Update Discussion</Text>
                <TouchableOpacity onPress={handleUpdate}>
                    <Text style={styles.submitText}>✓</Text>
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
                    <Picker.Item label="Select Category" value="" />
                    <Picker.Item label="Water Quality" value="Water Quality" />
                    <Picker.Item label="Sanitation" value="Sanitation" />
                    <Picker.Item label="Education" value="Education" />
                    <Picker.Item label="Climate" value="Climate" />
                    <Picker.Item label="Health" value="Health" />
                    <Picker.Item label="Q&A" value="Q&A" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            {/* Image Upload Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
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
        color: '#fff',
    },
    submitText: {
        fontSize: 24,
        color: '#6200EA', // Color for submit icon
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: 'white',
        marginBottom: 10,
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
        backgroundColor: "#6200EA",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    uploadText: {
        color: 'white',
        textAlign: 'center',
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    bodyTextInput: {
        height: 100,
    },
});

export default UpdatePage;
