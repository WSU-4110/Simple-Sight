//Factory Method

//Interface
class authInterface{
    userauthenticate(email, password){
        throw new Error("Implement method not found");
    }
}

// Factory type
class userAuth{
    static authType(choice){
        switch(choice){
            case 'signup':
                return new handlesignup();
            case 'login':
                return new handlelogin();
            default:
                throw new Error("Authentication choice is invalid");
        }
    }
}

class handlesignup extends authInterface{
    async userauthenticate(email,password){
        try{
            const userCredentials = await authUser.createUserWithEmailAndPassword(email,password);
            const user = userCredentials.user;
            console.log("user created: ", user.email, 'UID', user.uid);

            //store user infor in firestore
        await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          username: username,
          email: user.email,
        });
        console.log('User added to firestore');
        return 'Signup successful!';
        }catch(error){
            console.error('Signup error', error);
            throw new error(error.message);
        }
    }
}

class handlelogin extends authInterface{
    async userauthenticate(email,password){
        try{
            const userCredentials = await authUser.signInWithEmailAndPassword(email,password);
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
        }catch(error){
            console.error('Login Error:', error);
            throw error;
        }
    }
}