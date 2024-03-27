import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../user-stay/user';

const CreatePost = () => {
    const [photo, setPhoto] = useState(null);
    const [track, setTrack] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [savedTracks, setSavedTracks] = useState([]);
    const [comment, setComment] = useState('');
    const { user, setUser } = useUser();

    useEffect(() => {
        fetchSavedTracks();
    }, []);

    const fetchSavedTracks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_saved_tracks', {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch saved tracks');
            }
            const responseData = await response.json();
            setSavedTracks(responseData.saved_tracks);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to fetch saved tracks');
        }
    };

    const selectPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.uri);
        }
    };

    const handleTrackSelection = (itemValue) => {
        setSelectedTrack(itemValue); 
        const selectedTrack = savedTracks.find(track => track.track_id === itemValue);
        if (selectedTrack) {
            setTrack(`${selectedTrack.title} ${selectedTrack.artist}`);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/create_post', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    // photo: photo,
                    track: track,
                    comment: comment,
                    track_id: selectedTrack,
                    user_id: user.user_id
                })
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            const responseData = await response.json();
            Alert.alert('Success', 'Post created successfully');
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to create post');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Post</Text>
            {/* <Button title="Select Photo" onPress={selectPhoto} />
            {photo && <Image source={{ uri: photo }} style={styles.image} />} */}
            <TextInput
                style={styles.input}
                onChangeText={setComment}
                value={comment}
                placeholder="Enter your track comments"
            />
            <Picker
                selectedValue={selectedTrack}
                onValueChange={handleTrackSelection}
            >
                {Array.isArray(savedTracks) && savedTracks.map((track, index) => (
                    <Picker.Item key={index} label={`${track.title} - ${track.artist}`} value={track.track_id} />
                ))}
            </Picker>
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 20,
        padding: 10,
    },
});

export default CreatePost;
