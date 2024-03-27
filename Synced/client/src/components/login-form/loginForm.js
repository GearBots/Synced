import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../components/user-stay/user';

const LoginScreen = () => {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const {setUser} = useUser()
 const navigator = useNavigation();

 const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const user = await response.json();
      console.log('Login Success', user);
      setUsername(user.user);
      navigator.navigate('Home');
    } catch (error) {
      console.error(error.message);
      Alert.alert('Invalid Username or Password');
    }
    setUser({username: username, password: password})
 };

 const handleCreateUser = () => {
    navigator.navigate('Register');
 };

//  useEffect(() => {
//     fetch('/check_session').then((response) => {
//       if (response.ok) {
//         response.json().then((data) => {
//           setUsername(data.username);
//           navigator.navigate('Home');
//         });
//       }
//     }).catch((error) => {
//       console.error('Session check failed:', error);
//     });
//  }, []);

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputField}>
        <Button title='Login' onPress={handleLogin} />
      </View>
      <View style={styles.rememberMeForget}>
        <Text>Remember Me</Text>
        <TouchableOpacity onPress={handleCreateUser} style={styles.forgetPassword}>
          <Text style={styles.forgetPasswordText}>Forget Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.register}>
        <Text>Don't have an account? <Text onPress={handleCreateUser} style={styles.link}>Register</Text></Text>
      </View>
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
 },
 input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
 },
 forgetPassword: {
    marginTop: 10,
 },
 forgetPasswordText: {
    color: 'blue',
 },
 link: {
    color: 'blue',
 },
});

export default LoginScreen;
