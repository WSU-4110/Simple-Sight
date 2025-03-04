import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';

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

    const handleSignup = () => {
        setLoading(true);
        auth().createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                firestore().collection('users').doc(user.uid).set({
                    username: username,
                    email: user.email,
                });
                setMessage('Signup Successful!');
            })
            .catch(error => {
                setMessage(error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleLogin = () => {
        setLoading(true);
        auth().signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                if (stayLoggedIn) {
                    AsyncStorage.setItem('stayLoggedIn', 'true');
                }
                navigation.replace('home');
            })
            .catch(error => {
                setMessage(error.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize='none' />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
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
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    message: {
        marginTop: 10,
        color: 'red',
    },
});

