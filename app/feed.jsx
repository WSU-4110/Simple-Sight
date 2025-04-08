import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';

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

  const renderItem = ({item}) =>{
    const formattedDate = item.createdAt ? format(item.createdAt.toDate(), 'MMMM dd, yyyy'): 'Unknown Date';
    return(
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradientOverlay} />
        <View style={styles.textContainer}>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    );
  };
/*
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradientOverlay} />
      <View style={styles.textContainer}>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
    </View>
  );
*/
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
    height: 550,
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
  date:{
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 5,
  },
});