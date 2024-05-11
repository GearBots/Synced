// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet, Text, ImageBackground} from 'react-native';
const HomeScreen = ({ navigation }) => {
 return (
    <ImageBackground source={require('../../../../assets/synced.png')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View style={styles.container}>
      <Text style={styles.title}>Synced</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      {/* <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      /> */}
      <Button title="SET SAIL" onPress={() => navigation.navigate('YTSearch')} />
      <Button title ="Community" onPress={() => navigation.navigate('Community')} />
    </View>
    </ImageBackground>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#1c1919',
 },
 title: {
  fontSize: 70,
  color: 'yellow',
  fontWeight: 'bold',
  marginBottom: 20,
 }
});

export default HomeScreen;
