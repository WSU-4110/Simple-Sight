import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import {Picker} from '@react-native-picker/picker';
import { isToday } from 'date-fns';
import {Menu,Button,Provider as PaperProvider} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';

import {db} from './firebaseconfig';
import {collection, query, orderBy, onSnapshot,doc,getDoc} from 'firebase/firestore';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [filter, setFilter] = useState('All');
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = ()=>setMenuVisible(true);
  const closeMenu = ()=>setMenuVisible(false);

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
          console.error('Error fetching user for UID- ',uid,": ",error);
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

  //filter function that will filter posts with selection
  const filteredPosts = posts.filter((post)=>{
    if(filter == 'Today'){
      return post.createdAt && isToday(post.createdAt.toDate());
    }
    return true;
  });

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
    <PaperProvider>
     <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Button mode="outlined"
            onPress={openMenu}
            style={styles.dropdownButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            >
              {filter === 'Today' ? "Today's Moments ✨" : 'All Moments 📸'}
            </Button>
          }
          contentStyle={{ backgroundColor: '#fff' }}
        >
          <Menu.Item onPress={() => { setFilter('All'); closeMenu(); }} title="All Moments 📸" />
          <Menu.Item onPress={() => { setFilter('Today'); closeMenu(); }} title="Today's Moments ✨" />
        </Menu>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding:12,
  },
  dropdownContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 10,
  },
  
  dropdownButton: {
    width: '100%',
    borderRadius: 10,
  },
  buttonContent:{
    justifyContent:'center',
  },
  buttonLabel:{
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterContainer:{
    height: 60,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBotomColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 12,
    zIndex:1,
  },
  picker:{
    height:40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth:1,
    borderColor: '#ddd',
    marginHorizontal: 12,
    paddingVertical:0,
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