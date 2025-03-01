import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function Gallery() {
  const [post, setPost] = useState('');
  const [postMedia, setPostMedia] = useState(null);
  const [posts, setPosts] = useState([]);

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

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPostMedia(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (post || postMedia) {
      const newPost = {
        id: Date.now().toString(),
        text: post,
        media: postMedia,
      };
      setPosts([newPost, ...posts]);
      setPost('');
      setPostMedia(null);
      Keyboard.dismiss();
    }
  };

  const handleTakePicture = (id) => {
    const dummyImage = 'https://via.placeholder.com/200.png?text=User+Photo';
    setImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, uri: dummyImage } : img))
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.imageWrapper, { width: itemWidth, height: itemWidth }]}
      activeOpacity={0.8}
      onPress={() => !item.uri && handleTakePicture(item.id)}
    >
      {item.uri ? (
        <Image source={{ uri: item.uri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Tap to take picture</Text>
        </View>
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.overlay}>
        <Text style={styles.imageLabel}>Image {item.id}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postItem}>
      {item.text ? <Text style={styles.postText}>{item.text}</Text> : null}
      {item.media ? <Image source={{ uri: item.media }} style={styles.postImage} /> : null}
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <View style={styles.postContainer}>
            <TextInput
              style={styles.input}
              placeholder="What are you thinking?"
              placeholderTextColor="#aaa"
              value={post}
              onChangeText={setPost}
              multiline
            />
            {postMedia && <Image source={{ uri: postMedia }} style={styles.postMedia} />}
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.button} onPress={pickMedia}>
                <Text style={styles.buttonText}>Add Photo/Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handlePost}>
                <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Show "Posts" only when at least one post exists */}
          {posts.length > 0 && <Text style={styles.postsHeader}>Posts</Text>}

          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
          />
        </View>
      }
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    minHeight: 40,
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'left',
    color: '#333',
  },
  postItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  postText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 5,
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

