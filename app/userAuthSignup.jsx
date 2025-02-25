//Factory Method authentication

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from 'expo-router';
import userAuth from './userAuth';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
  
    const handleAuth = async (type) => {
      const authInstance = userAuth.createAuth(type);
      try {
        if (type === 'signup') {
          const msg = await authInstance.userauthenticate(email, password);
          setMessage(msg);
        } else {
          const msg = await authInstance.userauthenticate(email, password);
          setMessage(msg);
          navigation.navigate('home');
        }
      } catch (error) {
        alert(error.message);
      }
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign Up" onPress={() => handleAuth('signup')} />
        <Button title="Log In" onPress={() => handleAuth('login')} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginVertical: 10,
      borderRadius: 5,
    },
    message: {
      marginTop: 20,
      textAlign: 'center',
      color: 'green',
    },
  });