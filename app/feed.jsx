import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const posts = [
  {
    id: '1',
    title: 'Rose Garden',
    description: 'A beautiful rose garden in full bloom.',
    image: 'https://via.placeholder.com/400x300.png?text=Rose+Garden',
  },
  {
    id: '2',
    title: 'Sunset',
    description: 'Sunset over the mountains.',
    image: 'https://via.placeholder.com/400x300.png?text=Sunset',
  },
  {
    id: '3',
    title: 'City Lights',
    description: 'The city at night, sparkling lights.',
    image: 'https://via.placeholder.com/400x300.png?text=City+Lights',
  },
  {
    id: '4',
    title: 'Forest Walk',
    description: 'A peaceful walk in the forest.',
    image: 'https://via.placeholder.com/400x300.png?text=Forest+Walk',
  },
];

export default function Feed() {
  const numColumns = 2;
  const itemWidth = Dimensions.get('window').width / numColumns - 24;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { width: itemWidth }]} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.gradientOverlay} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
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
