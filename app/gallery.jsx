import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {format} from 'date-fns';
import {useRouter} from 'expo-router';
import {Menu,Provider as PaperProvider} from 'react-native-paper';

import {collection,query,where,orderBy,onSnapshot,deleteDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth';
import {db} from './firebaseconfig';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [menuVisible,setMenuVisible] = useState(null);

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
  
  //delete function
  const deletePic = async(photoId)=>{
    console.log('Trying to delete photo:', photoId);
    setTimeout(()=>{
      Alert.alert(
        'Delete Photo',
        'Are you sure you want to delete this photo?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Yes', onPress: async()=>{
            try{
              await deleteDoc(doc(db,'photos',photoId));
              Alert.alert('Photo Successfully Deleted');
              console.log('Photo Successfully Deleted: ', photoId);
            }catch(error){
              console.error('Error deleting photo:', error);
            }
          }
        }
        ]
      );
    },300);
  };

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

        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible===item.id}
            onDismiss={()=> setMenuVisible(null)}
            anchor={
              <TouchableOpacity onPress={()=>setMenuVisible(item.id)}>
                <Ionicons name="ellipsis-vertical" size={20} color="white"/>
              </TouchableOpacity>
            }
            >
              <Menu.Item title="Delete" onPress={()=>{
                setMenuVisible(null);
                setTimeout(()=>deletePic(item.id),100);
              }}/>
            </Menu>
        </View>
      </View>
    );
  };

  return (
    <PaperProvider>
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
    </PaperProvider>
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
  menuContainer:{
    position: 'absolute',
    top:8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },
});