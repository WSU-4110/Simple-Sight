import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';

import {db} from './firebaseconfig';
import {collection, query, orderBy, onSnapshot,doc,getDoc} from 'firebase/firestore';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [dailyPrompt, setDailyPrompt] = useState('');

  useEffect(() => {
    const fetchPrompt = async () => {
      const storedPrompt = await AsyncStorage.getItem("dailyPrompt");
      if (storedPrompt) {
        setDailyPrompt(storedPrompt);
      }
    };
    fetchPrompt();

    //fetch posts from firestore
    const q = query(collection(db, 'photos'), orderBy('createdAt','desc'));
    const unsubscribe = onSnapshot(q, async(snapshot)=>{
      const photolist = snapshot.docs.map(doc=>({
        id: doc.id,
        ...doc.data(),
      }));
      //get userId from photos
      const userIds = [...new Set(photolist.map(photo=>photo.userId))];
      //create map of userId -> username
      const userMap = {};
      await Promise.all(userIds.map(async(uid)=>{
        try{
          const userDoc = await getDoc(doc(db,'users',uid));
          if(userDoc.exists()){
            userMap[uid] = userDoc.data().username || 'User';
          }
          else{
            userMap[uid] = 'Unknown';
          }
        }catch(error){
          console.error('Error fetching user for UID ${uid}:',error);
          userMap[uid] = 'Unknown';
        }
      }));
      //Write username into each post
      const postsWithUsernames = photolist.map(photo=>({
        ...photo,
        username: userMap[photo.userId],
      }));
      setPosts(postsWithUsernames);
    });
    return unsubscribe;
  }, []);

  const renderItem = ({item}) =>{
    const formattedDate = item.createdAt ? format(item.createdAt.toDate(), 'MMMM dd, yyyy'): 'Unknown Date';
    return(
      <View style={styles.card}>
        {/* Display username*/}
        {item.username && (
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{item.username}</Text>
          </View>
        )}
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gradientOverlay} />
        <View style={styles.textContainer}>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    );
  };

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
    fontSize: 20,
    fontWeight: '400',
    marginTop: 5,
  },
  usernameContainer:{
    paddingHorizontal:10,
    paddingVertical:6,
    backgroundColor: '#f8d5e5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  username:{
    fontFamily: 'Garamond',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 10,
    marginTop: 6,
    color: '#4a4a4a',
  }
});