import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from './components/login-form/loginForm';
import RegisterForm from './components/register-form/registerForm';
import HomeScreen from './components/home-screen/homeScreen';
import YTSearch from './components/YT-Search/YTSearch';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   <NavigationContainer> 
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Register" component={RegisterForm} />
      <Stack.Screen name="YTSearch" component={YTSearch} />
      </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
