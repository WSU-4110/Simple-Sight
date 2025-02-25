import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A large list of cute & fun prompts
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

// Function to generate and store the daily prompt
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
    console.error("Error generating daily prompt:", error);
  }
};

export default function Feed() {
  // State for the daily prompt
  const [dailyPrompt, setDailyPrompt] = useState("");
  // State for feed posts (simulate that no images have been taken yet)
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'Rose Garden',
      description: 'A beautiful rose garden in full bloom.',
      image: null,
    },
    {
      id: '2',
      title: 'Sunset',
      description: 'Sunset over the mountains.',
      image: null,
    },
    {
      id: '3',
      title: 'City Lights',
      description: 'The city at night, sparkling lights.',
      image: null,
    },
    {
      id: '4',
      title: 'Forest Walk',
      description: 'A peaceful walk in the forest.',
      image: null,
    },
  ]);

  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

  // Simulate taking a picture (for now)
  const handleTakePicture = (id) => {
    // For simulation, we'll set a dummy image URL
    const dummyImage = 'https://via.placeholder.com/400x300.png?text=User+Photo';
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, image: dummyImage } : post
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: itemWidth }]}
      activeOpacity={0.8}
      onPress={() => {
        if (!item.image) {
          handleTakePicture(item.id);
        }
      }}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>Tap to take picture</Text>
          </View>
        )}
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.7)']} 
          style={styles.gradientOverlay} 
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    generateDailyPrompt(setDailyPrompt);
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.feedContainer}
      // Add the daily prompt as a footer component
      ListFooterComponent={
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>📸 Daily Prompt:</Text>
          <Text style={styles.promptText}>
            {dailyPrompt || "Loading prompt..."}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    fontSize: 14,
    color: '#555',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  cardText: {
    position: 'absolute',
    bottom: 5,
    left: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promptContainer: {
    backgroundColor: "#ffcccb",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  promptText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
});
