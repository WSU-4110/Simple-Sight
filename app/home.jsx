import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feed from './feed';
import Gallery from './gallery';
import { useNavigation, useRouter } from 'expo-router';
import Settings from './settings';
import Camera from './camera';
import { requestPermissions } from './notifications';
import * as Notifications from 'expo-notifications';

const prompts = [
  "Take a picture of a flower blooming. 🌸",
  "Find a heart shape in nature and capture it. 💚",
  "Capture a sunset or sunrise. 🌅",
  "Take a picture of your shadow in an interesting way. 🚶‍♂️",
  "Find a butterfly, bird, or cute bug and snap a pic! 🦋🐞",
  "Capture the reflection of the sky in water. 🌊",
  "Take a photo of a tree that looks unique. 🌳",
  "Find a cloud that looks like an animal. ☁️",
  "Take a picture of falling leaves or petals. 🍂",
  "Capture the sparkle of morning dew on grass. ✨",
  "Find a cute outfit or accessory and snap a pic. 👗",
  "Take a picture of a dog or cat. 🐶🐱",
  "Snap a photo of your favorite snack. 🍪",
  "Photograph something that makes you smile. 😊",
  "Take a picture of the sky right now! ☁️",
  "Find a bright color and take a picture of it. 🎨",
  "Take a picture of something tiny next to something big! 🔍",
  "Capture something symmetrical. 🔳",
];

const generateDailyPrompt = async (setDailyPrompt) => {
    const today = new Date().toDateString();
    
    try {
        const storedPrompt = await AsyncStorage.getItem("dailyPrompt");
        const storedDate = await AsyncStorage.getItem("promptDate");

        if (storedPrompt && storedDate === today) {
            setDailyPrompt(storedPrompt);
        } else {
            const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            setDailyPrompt(newPrompt);
            await AsyncStorage.setItem("dailyPrompt", newPrompt);
            await AsyncStorage.setItem("promptDate", today);
        }
    } catch (error) {
        console.error("🚨 ERROR FETCHING PROMPT:", error);
    }
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Home() {
  const [dailyPrompt, setDailyPrompt] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    generateDailyPrompt(setDailyPrompt);
    requestPermissions();

    // Notification Tap Listener
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data?.screen;
      
      if (screen === "Camera") {
        router.replace('/home')
      }
    });

    return () => subscription.remove(); 
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={() => <Tabs dailyPrompt={dailyPrompt} />} options={{ headerShown: false }} />
      <Stack.Screen name='Settings' component={Settings} />
    </Stack.Navigator>
  );
}

function Tabs({ dailyPrompt }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
      initialRouteName='Camera'
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#1E90FF' },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          tabBarActiveTintColor: '#1E90FF',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Feed') {
              iconName = 'grid-outline';
            } else if (route.name === 'Gallery') {
              iconName = 'images-outline';
            } else if (route.name === 'Camera') {
              iconName = 'camera-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
        <Tab.Screen name="Gallery" component={Gallery} />
      </Tab.Navigator>

      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>📸 Daily Prompt:</Text>
        <Text style={styles.prompt}>{String(dailyPrompt) || "Loading..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promptContainer: {
    backgroundColor: "#1E90FF",
    padding: 0.1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 80, 
    width: "100%",
  },
  promptText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", 
  },
  prompt: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
    color: "#FFFFFF",
  },
});