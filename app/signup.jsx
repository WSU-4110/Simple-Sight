
import React,{useEffect, useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import { useNavigation } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { getFirestore } from '@react-native-firebase/firestore';
import { Switch } from "react-native"

export default function signup(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [message,setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const navigation = useNavigation()

    //Signed in functions
    useEffect(()=> {
      /*
      const loadStayLoggedIn = async() => {
        try{
          const value = await AsyncStorage.getItem('stayLoggedIn');
          if (value!=null){
            setStayLoggedIn(JSON.parse(value));
          }
        }catch(error){
          console.error("Error loading stayLoggedIn value", error);
        }
      };
      */
      
      //Check if user is already logged in
      const checkUser = async() => {
        const storedUser = await AsyncStorage.getItem('user');
        if(storedUser){
          navigation.replace('home');
        }
          
      };
      checkUser();
      //loadStayLoggedIn();//checkUser();
    }, []);

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
            //AsyncStorage.setItem('stayLoggedIn', JSON.stringify(true));
            AsyncStorage.setItem('user',JSON.stringify({email: user.email, uid: user.uid}));

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
          //AsyncStorage.setItem('stayLoggedIn', JSON.stringify(true));
          AsyncStorage.setItem('user',JSON.stringify({email: user.email, uid: user.uid}));
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
            <Switch value={stayLoggedIn} onValueChange={setStayLoggedIn}/>
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
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginVertical:10,
    },
});
