import React, { useState } from 'react';

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

export default function Feed() {
  //no post has an image (simulate that the user hasn't taken any pictures yet)
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

  // This function simulates taking a picture.
  // In your final version, replace this with code to launch the camera.
  const handleTakePicture = (id) => {
    // For simulation, we'll set a dummy image URL.
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
          // simulate taking a picture when no image is present
          handleTakePicture(item.id);
        }
        // you might show the image in full screen or do something else.
      }}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          // if no image exists, show a placeholder prompt
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>Tap to take picture</Text>
          </View>
        )}
        {/* Optional gradient overlay for a stylish look */}
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.7)']} 
          style={styles.gradientOverlay} 
        />
<View style={styles.cardText}>
    <Text style={styles.cardTitle}>{item.title.toString()}</Text>
</View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
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
});
