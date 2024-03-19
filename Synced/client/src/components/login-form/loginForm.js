import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');


 const handleLogin = async (e) => {
    e.preventDefault()
    console.log('Username', username)
    console.log('Passeword', password)
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        if (!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const user = await response.json()
        console.log('Login Success', user)
        setUsername(user.user)
        navigator.navagate('Home')
    } catch(error) {
        console.error(error.message)
        alert('Invalid Username or Password')
    }
    useEffect(()=>{
        fetch('/check_session').then((response) => {
            if (response.ok) {
                setUsername(user)
                response.json().then((data) => handleLogin(data.username, data.password))
            }
        })
    })
 };

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
        <TouchableOpacity onPress={handleCreateUser}>
          <Text>Forget Password</Text>
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
});

export default LoginScreen;
