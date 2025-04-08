import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import{auth,db} from './firebaseconfig'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import {getDoc} from 'firebase/firestore';


//reworked to work with expo go dependencies instead of react-native firebase dependencies
export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        AsyncStorage.getItem('stayLoggedIn').then(value => {
            if (value === 'true') {
                navigation.replace('home');
            }
        });
    }, []);

    const handleSignup = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: user.email,
            });
            setMessage('Signup Successful!');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleLogin = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            console.log("User signed in:", user.uid);
    
            if (stayLoggedIn) {
                await AsyncStorage.setItem('stayLoggedIn', 'true');
            } else {
                await AsyncStorage.removeItem('stayLoggedIn'); // Remove if they didn’t choose stay logged in
            }
    
            // Fetch and store username
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const fetchedUsername = userDoc.data().username;
                await AsyncStorage.setItem("username", fetchedUsername);
                console.log("Stored username in AsyncStorage:", fetchedUsername);
            } else {
                console.log("No username found in Firestore");
            }
    
            navigation.replace('home');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };
    /*
    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (stayLoggedIn) {
                await AsyncStorage.setItem('stayLoggedIn', 'true');
            }
            navigation.replace('home');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };
    */

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.background} >
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize='none' placeholderTextColor={'gray'}/>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={'gray'}/>
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize='none' placeholderTextColor={'gray'}/>
            <View style={styles.switchContainer}>
                <Text>Stay Logged In</Text>
                <Switch value={stayLoggedIn} onValueChange={setStayLoggedIn} />
            </View>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#fff',
        width: '50%',
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        margin: 5,
      },
      buttonText: {
        color: '#a6c1ee',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
      },
    message: {
        marginTop: 10,
        color: 'red',
    },
});