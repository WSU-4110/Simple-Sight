import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableOpacity  } from 'react-native'; // TouchableOpacity removed
import { LinearGradient } from 'expo-linear-gradient';

export default function Gallery() {
  // NO IMAGES EXIST YET
  const [images, setImages] = useState([
    { id: '1', uri: null },
    { id: '2', uri: null },
    { id: '3', uri: null },
    { id: '4', uri: null },
    { id: '5', uri: null },
    { id: '6', uri: null },
  ]);

  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

  // simulate taking a picture
  const handleTakePicture = (id) => {
    const dummyImage = 'https://via.placeholder.com/200.png?text=User+Photo';
    setImages(prevImages =>
      prevImages.map(img => (img.id === id ? { ...img, uri: dummyImage } : img))
    );
  };

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
        <Text style={styles.imageLabel}>Image {item.id}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={images}
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
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    fontSize: 14,
    color: '#555',
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
