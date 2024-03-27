import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect} from 'react';


const Community = () => {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
   
    useEffect(() => {
        fetchPost();
    }, [])
    const fetchPost = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const responseData = await response.json();
            setPosts(responseData.posts);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to fetch posts');
        }
    };
    const handleCreatePost = () => {
        navigation.navigate('CreatePost');
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {posts.map((post, index) => (
                <View key={index} style={styles.postContainer}>
                    {post.comments.map((comment, commentIndex) => (
                        <Text key={commentIndex} style={styles.commentText}>{comment}</Text>
                    ))}
                    {/* {post.photos.map((photoUri, photoIndex) => (
                        <Image key={photoIndex} source={{ uri: photoUri }} style={styles.photo} />
                    ))} */}
                    {post.tracks.map((track, trackIndex) => (
                        <Text key={trackIndex} style={styles.trackText}>{track.title} by {track.artist}</Text>
                    ))}
                </View>
            ))}
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
    postContainer: {
        marginBottom: 20,
    },
    commentText: {
        fontSize: 16,
    },
    photo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    trackText: {
        fontSize: 16,
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
