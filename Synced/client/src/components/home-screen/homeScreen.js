// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { withExpoSnack } from 'nativewind';
const HomeScreen = ({ navigation }) => {
 return (
    <View style={styles.container}>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
      <Button title="YT Search" onPress={() => navigation.navigate('YTSearch')} />
      <Button title ="Community" onPress={() => navigation.navigate('Community')} />
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1919',
 },
});

export default HomeScreen;
