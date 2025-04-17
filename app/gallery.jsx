import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text, ActivityIndicator, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {format} from 'date-fns';
import { useNavigation, useRouter} from 'expo-router';
import {Menu,Provider as PaperProvider, Button} from 'react-native-paper';
import {collection,query,where,orderBy,onSnapshot,deleteDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth';
import {db} from './firebaseconfig';
import { Ionicons } from '@expo/vector-icons';
import FullscreenImage from './fullscreenImage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Gallery() {
  const navigation = useNavigation();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(null);
  const [gridView, setGridView] = useState(true);

  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = gridView ? screenWidth / 2 - 24 : screenWidth - 24;

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'photos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        uri: doc.data().imageUrl,
        createdAt: doc.data().createdAt,
      }));
      setImages(userImages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deletePic = async (photoId) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            try {
              await deleteDoc(doc(db, 'photos', photoId));
              Alert.alert('Photo Successfully Deleted');
            } catch (error) {
              console.error('Error deleting photo:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({item})=> {
    //format the date
    const formattedDate = item.createdAt ? format(item.createdAt.toDate(),'MMMM dd, yyyy'):'Unknown Date';
    return(
      <Pressable onPress={() => navigation.navigate('FullscreenImage', {url: item.uri})}>
        <View style={[styles.imageWrapper,{width: itemWidth,height: itemWidth}]} >
        
          <Image source = {{uri: item.uri}} style = {styles.image} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <Text style={styles.dateLabel}>{formattedDate}</Text>
        </LinearGradient>

        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <Ionicons name="ellipsis-vertical" size={20} color="white" onPress={() => setMenuVisible(item.id)} />
            }
          >
            <Menu.Item title="Delete" onPress={() => {
              setMenuVisible(null);
              setTimeout(() => deletePic(item.id), 100);
            }} />
          </Menu>
        </View>
      </View>
      </Pressable>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Toggle Button */}
        <Button
        mode="contained"
        onPress={() => setGridView(!gridView)}
        style={styles.toggleBtn}
        labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
        buttonColor="#007AFF"
     >
       {gridView ? 'Switch to List View' : 'Switch to Grid View'}
      </Button>

        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : (
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            key={gridView ? 'grid' : 'list'}
            numColumns={gridView ? 2 : 1}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </PaperProvider>
  );
}

export default function GalleryStack() {
  return(
    <Stack.Navigator initialRouteName='Gallery'>
      <Stack.Screen
      name='Gallery'
      component={Gallery}
      options={{ headerShown: false }}
      />
    <Stack.Screen
      name='FullscreenImage'
      component={FullscreenImage}
      options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  toggleBtn: {
    marginVertical: 9,
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 1,
    elevation: 2,
  },
  
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
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
  dateLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
  },
  menuContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },
});
