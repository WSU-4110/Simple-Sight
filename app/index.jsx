// index.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './welcome';
import Home from './home';
import Settings from './settings';
import Signup from './signup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#1E90FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
         name = "Signup"
         component={Signup}
         options = {{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
   
  );
}
