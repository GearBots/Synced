import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState("");

    const navigation = useNavigation();

    const handleCreateUser = async () => {
        if (password !== verifyPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error("Could not create user");
            }

            const data = await response.json();
            console.log(data);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error:', error);
            setError("Could not create user, please try again");
        }
    };

    return (
        <View style={styles.registerForm}>
            <Text>Create Account</Text>
            <TextInput
                style={styles.inputField}
                placeholder='Create Username'
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={styles.inputField}
                placeholder='Create Password'
                value={password}
                onChangeText={(text) => setPassword(text)}
                
            />
            <TextInput
                style={styles.inputField}
                placeholder='Verify Password'
                value={verifyPassword}
                onChangeText={(text) => setVerifyPassword(text)}
                
            />
            <Button style={styles.button} title='Create Account' onPress={handleCreateUser} />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    registerForm: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'teal',
    },
    inputField: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#FFFFFF',
        color: 'black',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    button: {
        backgroundColor: 'black',
        color: 'white',
        padding: 10,
        fontSize: 20,


    }
});

export default RegisterForm;
