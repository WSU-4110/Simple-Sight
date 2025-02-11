<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ FIXED IMPORT
=======
import React, { useEffect } from 'react';
>>>>>>> 830deb6761211d16e1b2cda95360deb33c87b0d2
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feed from './feed';
import Gallery from './gallery';
import { requestPermissions } from './notifications';

// CUTESY FUN PROMPTS
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

// function to generate and store the daily prompt
const generateDailyPrompt = async (setDailyPrompt) => {
    const today = new Date().toDateString();
    
    try {
        const storedPrompt = await AsyncStorage.getItem("dailyPrompt");
        const storedDate = await AsyncStorage.getItem("promptDate");

        console.log("📌 STORED PROMPT:", storedPrompt);
        console.log("📌 STORED DATE:", storedDate);
        console.log("📌 TODAY’S DATE:", today);

        if (storedPrompt && storedDate === today) {
            console.log("✅ Using stored daily prompt:", storedPrompt);
            setDailyPrompt(storedPrompt); // Keep today's prompt
        } else {
            const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            console.log("🎉 Generating new prompt:", newPrompt);

            setDailyPrompt(newPrompt);
            await AsyncStorage.setItem("dailyPrompt", newPrompt);
            await AsyncStorage.setItem("promptDate", today);
        }
    } catch (error) {
        console.error("🚨 ERROR FETCHING PROMPT:", error);
    }
};

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
<<<<<<< HEAD
  const [dailyPrompt, setDailyPrompt] = useState("");

  useEffect(() => {
    console.log("🔄 Running useEffect to generate daily prompt...");
    generateDailyPrompt(setDailyPrompt);
  }, []); 
=======
  useEffect(() => {
    //get notification permissions
    requestPermissions();
  }, []);
>>>>>>> 830deb6761211d16e1b2cda95360deb33c87b0d2

  return (
    <View style={{ flex: 1 }}>
      {/* Daily Prompt Section */}
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>📸 Daily Prompt:</Text>
        <Text style={styles.prompt}>{dailyPrompt || "Loading..."}</Text> {/* Default message if it's empty */}
      </View>

      {/* Bottom Tab Navigator */}
      <Tab.Navigator
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
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Gallery" component={Gallery} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  promptContainer: {
    backgroundColor: "#ffcccb",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  promptText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  prompt: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
});
