import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyD0wnMC4eEbSOXiBHhtalo9FPFaCzNRrzU",
    authDomain: "simple-sight.firebaseapp.com",
    projectId: "simple-sight",
    storageBucket: "simple-sight.firebasestorage.app",
    messagingSenderId: "874616789085",
    appId: "1:874616789085:web:1372b973f6dc882cf995b4",
    measurementId: "G-T9EVXN2RPD"
}

const app = initializeApp(firebaseConfig); // No config needed because it's auto-detected
const auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
const db = getFirestore(app);
//const db = firebaseConfig.firestore();
const storage = getStorage(app);

export { storage };
export {auth};
export {db};