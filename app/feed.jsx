import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import { isToday } from 'date-fns';
import {Menu,Button,Provider as PaperProvider} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import {db} from './firebaseconfig';
import {collection, query, orderBy, onSnapshot,doc,getDoc} from 'firebase/firestore';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [filter, setFilter] = useState('Today');
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = ()=>setMenuVisible(true);
  const closeMenu = ()=>setMenuVisible(false);

  const [dropdownWidth, setdropdownWidht] = useState(0);

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
            <View 
              style={styles.anchorWrapper}
              onLayout={(e)=>setdropdownWidht(e.nativeEvent.layout.width)}

            >
              <TouchableOpacity onPress={openMenu} style={styles.customDropdown}>
              <Text style={styles.dropdownText}>
                {filter === 'Today' ? "Today's Moments ✨" : "All Moments 📸"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="black"/>
            </TouchableOpacity>
            </View>
          }
          contentStyle={[styles.dropdownMenu,{width:dropdownWidth},]}
        >
          <TouchableRipple onPress={() => { setFilter('All'); closeMenu(); }}>
            <View style={styles.menuItemContainer}>
              <Text style={styles.menuItemText}>All Moments 📸</Text>
              </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => { setFilter('Today'); closeMenu(); }}>
            <View style={styles.menuItemContainer}>
              <Text style={styles.menuItemText}>Today's Moments ✨</Text>
            </View>
          </TouchableRipple>
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
    backgroundColor: '#D4D7ee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 10,
  },
  anchorWrapper:{
    width:'100%'
  },
  customDropdown:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#E0E2f1',
    paddingVertical: 10,
    borderRadius:10,
    borderWidth:1,
    borderColor: '#ddd',
    width:'100%',
  },
  dropdownText:{
    fontSize:16,
    fontWeight:'600',
    color:'black',
    marginRight: 8,

  },
  menuItemContainer:{
    width:'100%',
    alignItems:'center',
    paddingVertical:8,
  },
  menuItemText:{
    textAlign:'center',
    fontSize: 16,
    color: 'black',
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