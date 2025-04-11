import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {format} from 'date-fns';
import {useRouter} from 'expo-router';

import {collection,query,where,orderBy,onSnapshot} from 'firebase/firestore'
import {getAuth} from 'firebase/auth';
import {db} from './firebaseconfig';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

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
        createdAt: doc.data().createdAt,
        //name: 'Photo',

      }));
      console.log('Fetched photos:', userImages);
      setImages(userImages);
      setLoading(false);
    });
    return() => unsubscribe();
  },[]);
  /*
  const renderItem = ({ item }) => {
    const formattedDate = item.createdAt
      ? format(item.createdAt.toDate(), 'MMMM dd, yyyy')
      : 'Unknown Date';

    return (
      <TouchableOpacity
        style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}
        onPress={() => {
          try {
            console.log(`Navigating to fullScreen with uri: ${item.uri}`);
            router.push({
              pathname: '/fullScreenImage', // Static route for fullScreen
              query: { uri: item.uri }, // Pass the URI as a query parameter
            });
          } catch (error) {
            console.log('Error navigating to full image:', error);
          }
        }}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <Text style={styles.imageLabel}>{item.name}</Text>
          <Text style={styles.dateLabel}>{formattedDate}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  */
  
  

  /*
  const renderItem = ({ item }) => {
    const formattedDate = item.createdAt
      ? format(item.createdAt.toDate(), 'MMMM dd, yyyy')
      : 'Unknown Date';
  
    return (
      <TouchableOpacity
        style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}
        onPress={() => {
          try {
            console.log(`Uri before encoding ${item.uri}`);
            const encodedUri = encodeURIComponent(item.uri); // Keep URI encoded
            console.log(`Navigating to /fullScreen/ with encoded uri-${encodedUri}`);
            router.push({
              pathname: `/fullScreen/${encodedUri}` // Pass the encoded URI
            });
          } catch (error) {
            console.log('Error navigating to full image:', error);
          }
        }}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <Text style={styles.imageLabel}>{item.name}</Text>
          <Text style={styles.dateLabel}>{formattedDate}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  */
  

  /*
  const renderItem = ({ item }) => {
    const formattedDate = item.createdAt
      ? format(item.createdAt.toDate(), 'MMMM dd, yyyy')
      : 'Unknown Date';
  
    return (
      <TouchableOpacity
        style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}
        onPress={() => {
          try {
            const encodedUri = encodeURIComponent(item.uri); // Encoding the URI
            console.log(`Navigating to /fullScreen/${encodedUri}`);
            
            // Navigate to FullImage screen with URI as part of the URL
            router.push(`/fullScreen/${encodedUri}`); // Directly passing the encoded URI as part of the URL path
          } catch (error) {
            console.log('Error navigating to full image:', error);
          }
        }}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <Text style={styles.imageLabel}>{item.name}</Text>
          <Text style={styles.dateLabel}>{formattedDate}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  */
  

  /*
  const renderItem = ({ item }) => {
    const formattedDate = item.createdAt
      ? format(item.createdAt.toDate(), 'MMMM dd, yyyy')
      : 'Unknown Date';

    return (
      <TouchableOpacity
        style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}
        onPress={() => {
          try {
            console.log(`Navigating to /fullScreen/${encodeURIComponent(item.uri)}`);
            router.push({
              pathname: `/fullScreen/${encodeURIComponent(item.uri)}`
            });
          } catch (error) {
            console.log('Error navigating to full image:', error);
          }
        }}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <Text style={styles.imageLabel}>{item.name}</Text>
          <Text style={styles.dateLabel}>{formattedDate}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  */

  
  const renderItem = ({item})=> {
    //format the date
    const formattedDate = item.createdAt ? format(item.createdAt.toDate(),'MMMM dd, yyyy'):'Unknown Date';
    return(
      <View style={[styles.imageWrapper,{width: itemWidth,height: itemWidth}]}>
        <Image source = {{uri: item.uri}} style = {styles.image}/>
        <LinearGradient
          colors = {['transparent','rgba(0,0,0,0.5)']}
          style = {styles.overlay}>
            <Text style={styles.imageLabel}>{item.name}</Text>
            <Text style={styles.dateLabel}>{formattedDate}</Text>
        </LinearGradient>
      </View>
    );
  };
  
  
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
  dateLabel:{
    color:'#fff',
    fontSize:12,
    fontWeight: '400',
    marginTop: 4,
  },
});