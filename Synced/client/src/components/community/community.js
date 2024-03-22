import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock data
const comments = ['Eminem Schooled him', 'mgk went nuts'];
const photos = ['data:image/jpeg;base64,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', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jPSn9pwfebhy8nk4quZHam_YNyR4541LjQ&usqp=CAU'];
const tracks = [
 { title: 'Kill Shot', artist: 'Eminem' },
 { title: 'RAP DEVIL', artist: 'Machine Gun Kelly' },
];

const Comment = ({ text }) => (
 <View style={{ padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0' }}>
    <Text>{text}</Text>
 </View>
);

const Photo = ({ uri }) => (
 <View style={{ marginVertical: 5 }}>
    <Image source={{ uri }} style={{ width: '100%', height: 200 }} />
 </View>
);

const Track = ({ title, artist }) => (
 <View style={{ padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0' }}>
    <Text>{title} - {artist}</Text>
 </View>
);

const Community = () => {
    const navigator = useNavigation();
   
    const handleCreatePost = () => {
       navigator.navigate('CreatePost');
       console.log('Post created!');
    }
   
    return (
       <ScrollView contentContainerStyle={styles.container}>
           <View>
               {comments.map((comment, index) => (
               <Comment key={index} text={comment} />
               ))}
               {photos.map((photoUri, index) => (
               <Photo key={index} uri={photoUri} />
               ))}
               {tracks.map((track, index) => (
               <Track key={index} title={track.title} artist={track.artist} />
               ))}
           </View>
           <TouchableOpacity onPress={handleCreatePost} style={styles.CreatePost}>
               <Text style={styles.CreatePostText}>Create Post</Text>
           </TouchableOpacity>
       </ScrollView>
    );
   };
const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
       justifyContent: 'space-between',
    },
    CreatePost: {
       alignSelf: 'center',
       marginBottom: 20,
       padding: 10,
       backgroundColor: '#007BFF',
       borderRadius: 5,
    },
    CreatePostText: {
       color: '#FFFFFF',
       fontSize: 16,
    },
   });

export default Community;
