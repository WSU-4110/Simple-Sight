import { handleSignup,handleLogin } from "../app/authFunctions";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth } from "firebase/auth";
import {setDoc, getDoc,doc,getFirestore} from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import exp from "constants";

//Mocks
jest.mock('firebase/auth',()=>({
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore',()=>({
    getFirestore: jest.fn(),
    setDoc: jest.fn(),
    getDoc : jest.fn(),
    doc: jest.fn()
}));

describe('Authentication Functions', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        AsyncStorage.clear();
    });

    test('Successful user signup (handSignup)',async()=>{
        createUserWithEmailAndPassword.mockResolvedValueOnce({user: {uid: '123', email:'jestsignup@gmail.com'}});
        const message = await handleSignup('jestsignup@gmail.com','password#123', 'testjest');
        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(setDoc).toHaveBeenCalled();
        expect(message).toBe('Signup Successful!');

    });
});