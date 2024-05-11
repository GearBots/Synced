import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Community = () => {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    
    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_posts');
            const responseData = await response.json();
            setPosts(responseData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/delete_post/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            setPosts(posts.filter(post => post.community_id !== postId));
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to delete post');
        }
    };

    const updateComments = async (postId, newComment) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/update_comment/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: newComment }),
            });
            if (!response.ok) {
                throw new Error('Failed to update comments');
            }
            const updatedPost = await response.json();
            setPosts(posts?.map(post => post.community_id === postId ? updatedPost : post));
            fetch('http://127.0.0.1:5000/get_posts')
            .then(res => res.json())
            .then(setPosts)

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to update comments');
        }
    };


    const showUpdateModal = (post) => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    const handleCreatePost = () => {
        navigation.navigate('CreatePost');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleCreatePost} style={styles.CreatePost}>
                <Text style={styles.CreatePostText}>Create Post</Text>
            </TouchableOpacity>
            {posts?.map((post, index) => (
                <View key={index} style={styles.postContainer}>
                    <Text style={styles.commentText}>{post.comment}</Text>
                    {post.photo && <Image source={{ uri: post.photo }} style={styles.photo} />}
                    <Text style={styles.trackText}>Artist: {post.artist}</Text>
                    <Text style={styles.trackText}>Track: {post.title}</Text>
                    <Text style={styles.trackText}>User: {post.username}</Text>
                    <TouchableOpacity onPress={() => showUpdateModal(post)}>
                        <Text>Update Comments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePost(post.community_id)}>
                        <Text>Delete Post</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setNewComment(text)}
                            value={newComment}
                            placeholder="Enter new comment"
                        />
                        <Button
                            onPress={() => {
                                updateComments(selectedPost.community_id, newComment);
                                setModalVisible(!modalVisible);
                            }}
                            title="Update Comment"
                        />
                        <Button
                            onPress={() => setModalVisible(!modalVisible)}
                            title="Cancel"
                        />
                    </View>
                </View>
            </Modal>
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default Community;
