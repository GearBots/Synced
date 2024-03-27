import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from './components/login-form/loginForm';
import RegisterForm from './components/register-form/registerForm';
import HomeScreen from './components/home-screen/homeScreen';
import YTSearch from './components/YT-Search/YTSearch';
import Download from './components/download/download';
import Community from './components/community/community';
import CreatePost from './components/create-post/createPost';
import { UserProvider } from './components/user-stay/user';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer> 
        <Stack.Navigator>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginForm} />
          <Stack.Screen name="Register" component={RegisterForm} />
          <Stack.Screen name="YTSearch" component={YTSearch} />
          <Stack.Screen name="download" component={Download} />
          <Stack.Screen name="Community" component={Community} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
        </Stack.Navigator>
      </NavigationContainer>
   </UserProvider>
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
