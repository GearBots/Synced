import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

const Downloader = () => {
 const [url, setUrl] = useState('');
 const [downloadPath, setDownloadPath] = useState('');
 const [title, setTitle] = useState('');
 const [artist, setArtist] = useState('');
 const [genre, setGenre] = useState('');


 const downloadAudio = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    // Define the download path
    const path = FileSystem.documentDirectory + '/downloads/';
    await FileSystem.makeDirectoryAsync(path, { intermediates: true }); // Create the directory if it doesn't exist
    const filename = url.split('/').pop().split('?')[0]; // Extract filename from URL
    const filePath = `${path}${filename}.mp3`;

    // Download the file
    try {
      const { uri } = await FileSystem.downloadAsync(url, filePath);
      console.log('File downloaded to ', uri);
      setDownloadPath(uri);
      Alert.alert('Success', 'File downloaded successfully');
    } catch (error) {
      console.error('Download error: ', error);
      Alert.alert('Error', 'Failed to download file');
    }
 };
 const handleDownload = async () => {
   if (!url || !title || !artist || !genre) {
     Alert.alert('Error', 'Please fill out all');
     return;
   }
   try {
    const response = await fetch('http://127.0.0.1:5000/tracks', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        url: url,
        title: title,
        artist: artist,
        genre: genre,
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    console.log(responseData);
    Alert.alert('Success', 'Track information sent successfully');
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Failed to send track information');
  }
};

 return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter YouTube video URL"
        onChangeText={setUrl}
        value={url}
      />
      <TextInput 
        style={styles.input}
        placeholder="Artist Name"
        onChangeText={setArtist}
        value={artist}
      />
      <TextInput
        style={styles.input}
        placeholder="Track Name"
        onChangeText={setTitle}
        value={title}
      />
      <TextInput 
        style={styles.input}
        placeholder="Genre"
        onChangeText={setGenre}
        value={genre}
      />
      <Button title="Save" onPress={handleDownload} />
      <Button title="Download Audio" onPress={downloadAudio}  />
      {downloadPath && <Text>Downloaded to: {downloadPath}</Text>}
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
 },
 input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
 },
});

export default Downloader;
