import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Gallery() {
  const [images, setImages] = useState([
    { id: '1', uri: null, name: 'Image 1' },
    { id: '2', uri: null, name: 'Image 2' },
    { id: '3', uri: null, name: 'Image 3' },
    { id: '4', uri: null, name: 'Image 4' },
    { id: '5', uri: null, name: 'Image 5' },
    { id: '6', uri: null, name: 'Image 6' },
  ]);
  const [loading, setLoading] = useState(false);

  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

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

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      onEndReached={loadMoreImages}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="large" color="#1E90FF" /> : null}
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