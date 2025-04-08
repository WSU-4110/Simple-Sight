import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {db} from './firebaseconfig';
import {collection, query, orderBy, onSnapshot} from 'firebase/firestore';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [dailyPrompt, setDailyPrompt] = useState('');

  useEffect(() => {
    const fetchPrompt = async () => {
      const storedPrompt = await AsyncStorage.getItem("dailyPrompt");
      if (storedPrompt) {
        setDailyPrompt(storedPrompt);
        //setExamplePosts(storedPrompt);
      }
    };
    fetchPrompt();
    //fetch posts from firestore
    const q = query(collection(db, 'photos'), orderBy('createdAt','desc'));
    const unsubscribe = onSnapshot(q, (snapshot)=>{
      const photolist = snapshot.docs.map(doc=>({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(photolist);
    });

    return unsubscribe;
  }, []);


/*
  const setExamplePosts = (prompt) => {
    const promptLower = prompt.toLowerCase();
    let examplePosts = [];

    if (promptLower.includes('flower')) {
      examplePosts = [
        { id: '1', description: 'A beautiful rose garden in full bloom.', image: 'https://via.placeholder.com/400x300.png?text=Rose+Garden' },
        { id: '2', description: 'Wildflowers growing in the park.', image: 'https://via.placeholder.com/400x300.png?text=Wildflowers' },
        { id: '3', description: 'A close-up of a sunflower.', image: 'https://via.placeholder.com/400x300.png?text=Sunflower' },
        { id: '4', description: 'Cherry blossoms in spring.', image: 'https://via.placeholder.com/400x300.png?text=Cherry+Blossoms' },
      ];
    } else if (promptLower.includes('sunset')) {
      examplePosts = [
        { id: '5', description: 'A breathtaking sunset over the ocean.', image: 'https://via.placeholder.com/400x300.png?text=Ocean+Sunset' },
        { id: '6', description: 'Sunset in the city skyline.', image: 'https://via.placeholder.com/400x300.png?text=City+Sunset' },
        { id: '7', description: 'A mountain view at dusk.', image: 'https://via.placeholder.com/400x300.png?text=Mountain+Sunset' },
        { id: '8', description: 'Sunset reflecting on a lake.', image: 'https://via.placeholder.com/400x300.png?text=Lake+Sunset' },
      ];
    } else if (promptLower.includes('sky')) {
      examplePosts = [
        { id: '9', description: 'A clear blue sky with fluffy clouds.', image: 'https://via.placeholder.com/400x300.png?text=Blue+Sky' },
        { id: '10', description: 'A rainbow after the rain.', image: 'https://via.placeholder.com/400x300.png?text=Rainbow' },
        { id: '11', description: 'Stars shining in the night sky.', image: 'https://via.placeholder.com/400x300.png?text=Night+Sky' },
        { id: '12', description: 'A sunrise with golden hues.', image: 'https://via.placeholder.com/400x300.png?text=Sunrise' },
      ];
    } else {
      examplePosts = [
        { id: '13', description: `Try capturing: ${prompt}`, image: 'https://via.placeholder.com/400x300.png?text=Example+Post' },
        { id: '14', description: `Another take on: ${prompt}`, image: 'https://via.placeholder.com/400x300.png?text=Alternate+Example' },
        { id: '15', description: `A creative angle of: ${prompt}`, image: 'https://via.placeholder.com/400x300.png?text=Creative+Shot' },
        { id: '16', description: `A unique perspective on: ${prompt}`, image: 'https://via.placeholder.com/400x300.png?text=Perspective' },
      ];
    }

    setPosts(examplePosts);
  };
*/
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradientOverlay} />
      <View style={styles.textContainer}>
        {item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 12,
  },
  promptText:{
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height:550,
    resizeMode:'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});