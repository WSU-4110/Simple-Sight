import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyD0wnMC4eEbSOXiBHhtalo9FPFaCzNRr",
    authDomain: "simple-sight.firebaseapp.com",
    projectId: "simple-sight",
    storageBucket: "simple-sight.firebasestorage.app",
    messagingSenderId: "874616789085",
    appId: "1:874616789085:web:1372b973f6dc882cf995b4",
    measurementId: "G-T9EVXN2RPD"
}

const app = initializeApp(firebaseConfig); // No config needed because it's auto-detected
const storage = getStorage(app);

export { storage };
