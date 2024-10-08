import React, {useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const SourceForm = () => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
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

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log({name, latitude, longitude, description, photos});
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton}>
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
            <TouchableOpacity style={[styles.submitButton, {backgroundColor: "blue"}]} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText} onPress={pickImage}>Attach Photo</Text>
            </TouchableOpacity>
            <View style={styles.photosContainer}>
                {photos.map((photo, index) => (
                    <Image key={index} source={{uri: photo}} style={styles.photo}/>
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
        backgroundColor: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 30,
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: 24,
        color: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 100,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
    },
    multiInput: {
        textAlignVertical: 'top',
        height: 100,
    },
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    photo: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: 'grey',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default SourceForm;