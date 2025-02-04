import React from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const images = [
  { id: '1', uri: 'https://via.placeholder.com/200.png?text=Image+1' },
  { id: '2', uri: 'https://via.placeholder.com/200.png?text=Image+2' },
  { id: '3', uri: 'https://via.placeholder.com/200.png?text=Image+3' },
  { id: '4', uri: 'https://via.placeholder.com/200.png?text=Image+4' },
  { id: '5', uri: 'https://via.placeholder.com/200.png?text=Image+5' },
  { id: '6', uri: 'https://via.placeholder.com/200.png?text=Image+6' },
];

export default function Gallery() {
  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

  const renderItem = ({ item }) => (
    <View style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.overlay}>
        <Text style={styles.imageLabel}>Image {item.id}</Text>
      </LinearGradient>
    </View>
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
