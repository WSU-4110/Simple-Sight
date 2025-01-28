
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './welcome';
import Home from './home';
import Settings from './settings';

const Stack = createNativeStackNavigator();

let isLoggedIn = false
let initialRouteName

if (isLoggedIn) {
    initialRouteName = "Home"
} else {
    initialRouteName = "Welcome"
}

export default function App() {
  return (
        <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
            headerShown: false,
        }}
        >
            {/* ALL navigation links must be placed here */}
            <Stack.Screen name='Welcome' component={Welcome} />
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Settings' component={Settings} />
        </Stack.Navigator>
  )
}