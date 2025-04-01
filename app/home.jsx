import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feed from './feed';
import Gallery from './gallery';
import Settings from './settings';
import Camera from './camera';
import { requestPermissions } from './notifications';
import * as Notifications from 'expo-notifications';
import { useNavigation, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseconfig';
import Welcome from './welcome'; // your login screen

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

<<<<<<< HEAD
export const generateDailyPrompt = async (setDailyPrompt) => {
=======
const generateDailyPrompt = async (setDailyPrompt) => {
>>>>>>> Kailiebranch
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

<<<<<<< HEAD
  // 🔐 Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📆 Daily prompt & notification setup
=======
>>>>>>> Kailiebranch
  useEffect(() => {
    generateDailyPrompt(setDailyPrompt);
    requestPermissions();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data?.screen;

      if (screen === "Camera") {
        router.replace('/home');
      }
    });

    return () => subscription.remove();
  }, []);

  // ⏳ Loading screen while checking auth
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  // 🔒 If user not logged in, show Welcome/login screen
  if (!user) {
    return <Welcome />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }} children={() => <Tabs dailyPrompt={dailyPrompt} />} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

function Tabs({ dailyPrompt }) {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Camera"
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
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 75,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            paddingBottom: 5,
          },
          tabBarIconStyle: {
            width: 30,
            height: 30,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Feed') {
              iconName = 'grid-outline';
            } else if (route.name === 'Gallery') {
              iconName = 'images-outline';
            } else if (route.name === 'Camera') {
              iconName = 'camera-outline';
            }
            return <Ionicons name={iconName} size={30} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
        <Tab.Screen name="Gallery" component={Gallery} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
=======
  promptContainer: {
    backgroundColor: "#1E90FF",
    padding: 0.1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 75,
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
>>>>>>> Kailiebranch
});
