import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';

export default function Welcome() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.container}>
      <Text style={styles.title}>Welcome to Simple‑Sight</Text>
      <Text style={styles.subtitle}>
        Capture and share the beauty around you.
      </Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('signup')}
        >
          <Text style={styles.buttonText}>Register / Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#a6c1ee',
    fontSize: 18,
    fontWeight: '600',
  },
});
