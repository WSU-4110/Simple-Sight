import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getFirestore } from '@react-native-firebase/firestore';
import { Switch } from "react-native"
import { useNavigation } from 'expo-router';
import { setLogLevel } from '@react-native-firebase/app';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation()

    //Signed in functions
    useEffect(()=> {
      const checkUser = async()=>{
        const stayLogged = await AsyncStorage.getItem('stayLoggedIn');
        auth().onAuthStateChanged(user=>{
          if(user && JSON.parse(stayLogged)){
            console.log('User already logged in: ', user.email);
            navigation.replace('home');
          }
          setLoading(false);
        });
      };
      checkUser();
    }, []);

    //toggle stay logged in and save to async storage
    const toggleStayLoggedIn = async(value)=>{
      setStayLoggedIn(value);
      await AsyncStorage.setItem('stayLoggeIn', JSON.stringify(value));
    };

    const handlesignup = () => {
      auth()
        .createUserWithEmailAndPassword(email,password)
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log("USer created:",user.email, "UID", user.uid);

          //store user infor in firestore
          firestore()
            .collection('users')
            .doc(user.uid)
            .set({
              username: username,
              email: user.email,
            });

          if(stayLoggedIn){
            AsyncStorage.setItem('stayLoggedIn', JSON.stringify(true));
            //AsyncStorage.setItem('user',JSON.stringify({email: user.email, uid: user.uid}));

          }
         
        })
        .then(()=>{
          console.log("User successfully added to firestore");
          setMessage('Signup Successful!');
        })
        .catch(error=>{
          console.error("Firestore error:", error);
          alert(error.message);
        });
    };

  const handlelogin = () => {
    auth()
      .signInWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
        if(stayLoggedIn){
          AsyncStorage.setItem('stayLoggedIn', JSON.stringify(true));
          //AsyncStorage.setItem('user',JSON.stringify({email: user.email, uid: user.uid}));
        }
        setMessage('Login Successful!');
        navigation.replace('home');
      })
      .catch(error => alert(error.message))
  }


    return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
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
          <View style={styles.switchContainer}>
            <Text>Stay Logged In</Text>
            <Switch value={stayLoggedIn} onValueChange={toggleStayLoggedIn}/>
          </View>
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
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginVertical: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    signupButton: {
        backgroundColor: '#81E7FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    loginButton: {
        backgroundColor: '#81E7FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 20,
        textAlign: 'center',
        color: 'green',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginVertical:10,
    },
    message:{
      marginTop: 20,
      textAlign: 'center',
      color:'green',
    },
});
