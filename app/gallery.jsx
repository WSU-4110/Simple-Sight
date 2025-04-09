import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {collection,query,where,orderBy,onSnapshot} from 'firebase/firestore'
import {getAuth} from 'firebase/auth';
import {db} from './firebaseconfig';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

  /*
  const handleTakePicture = (id) => {
    const dummyImage = 'https://via.placeholder.com/200.png?text=User+Photo';
    setImages(prevImages =>
      prevImages.map(img => (img.id === id ? { ...img, uri: dummyImage } : img))
    );
  };
  

  const loadMoreImages = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        const newImages = Array.from({ length: 6 }, (_, i) => ({
          id: (images.length + i + 1).toString(),
          uri: null,
          name: `Image ${images.length + i + 1}` // Ensure all new images have proper names
        }));
        setImages(prevImages => [...prevImages, ...newImages]);
        setLoading(false);
      }, 1000);
    }
  };
  */

  useEffect(()=>{
    const auth = getAuth();
    const user = auth.currentUser;

    if(!user) return;
    //query to only pull photos with the current users uid
    const q = query(
      collection(db, 'photos'),
      where('userId','==', user.uid),
      //order by newest first
      orderBy('createdAt','desc') 
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userImages = snapshot.docs.map((doc)=>({
        id:doc.id,
        uri: doc.data().imageUrl,
        //name: 'Photo',

      }));
      console.log('Fetched photos:', userImages);
      setImages(userImages);
      setLoading(false);
    });
    return() => unsubscribe();
  },[]);

  const renderItem = ({item})=> (
    <View style={[styles.imageWrapper,{width: itemWidth,height: itemWidth}]}>
      <Image source = {{uri: item.uri}} style = {styles.image}/>
      <LinearGradient
        colors = {['transparent','rgba(0,0,0,0.5)']}
        style = {styles.overlay}>
          <Text style={styles.imageLabel}>{item.name}</Text>
        </LinearGradient>
    </View>
  );

  /*
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}
      activeOpacity={0.8}
      onPress={() => {
        if (!item.uri) {
          handleTakePicture(item.id);
        }
      }}
    >
      {item.uri ? (
        <Image source={{ uri: item.uri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Tap to take picture</Text>
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <Text style={styles.imageLabel}>{item.name}</Text> 
      </LinearGradient>
    </TouchableOpacity>
  );
  */

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size = "large" color="#1E90FF"/>
      ):(
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={{paddingBottom: 24}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  imageWrapper: {
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 8,
  },
  imageLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});