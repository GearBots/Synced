
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import {WebView} from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';

const YTSearch = ({navigation}) => {
   const [searchQuery, setSearchQuery] = useState('');
   const [results, setResults] = useState([]);
   // const [showWeb, setShowWeb] = useState(false);
   const [youtubeUrl, setYoutubeUrl] = useState('');

 const handleSearch = async() => {
   const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
         q: searchQuery,
         part: 'snippet',
         maxResults: 5,
         thumbnails: 'default',
         key: 'AIzaSyCovJZcMllG-ELoZcJkDfnJ7N81WoTXyeo',
      },
   })
   setResults(response.data.items);
 };

 const copyToClipboard = (url) => {
   Clipboard.setString(url);
   alert('Link copied to clipboard');
 }

//  const openVideo = (videoId) => {
//     const url = `https://www.youtube.com/watch?v=${videoId}`
//     setYoutubeUrl(url)
//     setShowWeb(true)
//  }

 return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search..."
      />
      <Button title="Synced" onPress={() => navigation.navigate('download')} />
      <Button title='Search' onPress={handleSearch} />
      {results.map((item, index) => (
         <View key={index} style={styles.resultContainer}>
            <Image
               source={{ uri: item.snippet.thumbnails.default.url }}
               style={styles.thumbnail}
            />
            <TouchableOpacity onPress={() => setYoutubeUrl(`https://www.youtube.com/watch?v=${item.id.videoId}`)}>
               <Text>{item.snippet.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(`https://www.youtube.com/watch?v=${item.id.videoId}`)}>
               <Text>Copy Link</Text>
            </TouchableOpacity>
         </View>
      ))}
      {youtubeUrl && (
         <WebView
            source={{uri: youtubeUrl }}
            style={{ flex: 1 }}
         />
      )}
    </View>
 );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 10,
   },
   input: {
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 10,
      padding: 5,
   },
   resultContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
   },
   thumbnail: {
      width: 50,
      height: 50,
      marginRight: 10,
   },
  });

export default YTSearch;
