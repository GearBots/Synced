import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Picker } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreatePost = () => {
    const [photo, setPhoto] = useState(null);
    const [track, setTrack] = useState('');

    useEffect(() => {
        fetchSavedTracks();   
    }, []);
    const fetchSavedTracks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/saved_tracks', {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok){
                throw new Error(`Error: ${response.status}`);
            }
            const responseData = await response.json()
            setSavedTracks(responseData);
        } catch (error) {
            console.error(error.message);
        }
    }
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

    const handleSubmit = () => {
        console.log('Photo:', photo);
        console.log('Track:', track);
        // Implement your logic here for submitting the post
    };



    return (
        <View style={styles.container}>
         <Text style={styles.title}>Create Post</Text>
         <Picker selectedValue={selectedTrack} onValueChange={(itemValue, itemIndex) => setSelectedTrack(itemValue)}> {savedTracks.map((track, index) => (<Picker.Item key={index} label={`${track.title} - ${track.artist}`} value={track.track_id} /> ))}
         </Picker>
        <Button title="Select Photo" onPress={selectPhoto} />
          {photo && <Image source={{ uri: photo }} style={styles.image} />}
         <TextInput

         style={styles.input}
         onChangeText={setTrack}
         value={track}
          placeholder="Enter track details"
        />
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
