import { handleSignup,handleLogin } from "../app/authFunctions";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth } from "firebase/auth";
import {setDoc, getDoc,doc,getFirestore} from 'firebase/firestore'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import exp from "constants";

//Mocks
const mockNavigation = {
    replace: jest.fn(),
};

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
    

    test('Error for user signing up (handleSignup)', async()=>{
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Signup failed'));
        const message = await handleSignup('errorsignup@gmail.com','password#123','testjestbad');

        expect(message).toBe('Signup failed');
    });
    test('handleLogin will stores username and sets stayLoggedin value to true', async()=>{
        signInWithEmailAndPassword.mockResolvedValueOnce({user:{uid:'123'}});
        getDoc.mockResolvedValueOnce({exists: ()=>true,data:()=>({username:'testjest'})});
        const message = await handleLogin('jestsignup@gmail.com','password#123',true,mockNavigation);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('username','testjest');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('stayLoggedIn','true');
        expect(mockNavigation.replace).toHaveBeenCalledWith('home');
        expect(message).toBe('Login Successful!');
    });

    test('handlelogin when stayloggedin is false',async()=>{
        signInWithEmailAndPassword.mockResolvedValueOnce({user: {uid: '123'}});
        getDoc.mockResolvedValueOnce({exists:()=> true,data:()=>({username:'testjest'})});

        const message = await handleLogin('jestsignup@gmail.com','password#123',false,mockNavigation);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('stayLoggedIn');
        expect(message).toBe('Login Successful!');
    });

    test('handleLogin gives message when login fails', async()=>{
        signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Login failed'));
        const message = await handleLogin('badlogin@gmail.com','badpassword',false);
        expect(message).toBe('Login failed');
    })

    
});
