import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

const Downloader = () => {
 const [url, setUrl] = useState('');
 const [downloadPath, setDownloadPath] = useState('');

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

 return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter YouTube video URL"
        onChangeText={setUrl}
        value={url}
      />
      <Button title="Download Audio" onPress={downloadAudio} />
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
