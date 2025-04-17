// authFunctions.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, getDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseconfig';

export const handleSignup = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: user.email,
    });

    return 'Signup Successful!';
  } catch (error) {
    return error.message;
  }
};

export const handleLogin = async (email, password, stayLoggedIn, navigation) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (stayLoggedIn) {
      await AsyncStorage.setItem('stayLoggedIn', 'true');
    } else {
      await AsyncStorage.removeItem('stayLoggedIn');
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const fetchedUsername = userDoc.data().username;
      await AsyncStorage.setItem('username', fetchedUsername);
    }

    navigation.replace('home');
    return 'Login Successful!';
  } catch (error) {
    return error.message;
  }
};
