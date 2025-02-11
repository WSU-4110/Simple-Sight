
import React,{useEffect, useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import { useNavigation } from 'expo-router';

export default function Signup(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const navigation = useNavigation()

  console.log(navigation)

  const handlesignup = () => {
    auth()
      .createUserWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(user.email);
        setMessage('Signup Successful!');
      })
      .catch(error => alert(error.message))
      
  };

  const handlelogin = () => {
    auth()
      .signInWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
        setMessage('Login Successful!');
        navigation.replace('home');
      })
      .catch(error => alert(error.message))
  }


  return (
      <View style={styles.container}>
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
        <Button title="Sign Up" onPress={handlesignup} />
        <Button title="Log In" onPress={handlelogin} />
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
