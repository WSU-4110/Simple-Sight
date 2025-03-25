import { View, Text, StyleSheet, TextInput, Switch, ScrollView, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { persistentKeys } from '../constants/persistenceKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { disableNotifications, getRandomTime, scheduleDailyNotification, scheduleNotificationNow } from './notifications';
import{auth,db} from './firebaseconfig'
import{doc,getDoc,updateDoc} from 'firebase/firestore'
import{getIdToken, signOut} from 'firebase/auth'
import { useNavigation } from 'expo-router';

//fetch start time value stored on phone
export async function fetchStartTime() {
  let startTime;

    try {
      startTime = await AsyncStorage.getItem(persistentKeys.startTimeKey);
      if (!startTime) {
        startTime = new Date();
        startTime.setHours(8, 0, 0, 0);
      } else {
        startTime = new Date(startTime);
      }
    } catch (error) {
      console.log("Error retrieving start date", error);
      return new Date();
    }
    return new Date(startTime);
  }
  
  // end time stored on phone
  export async function fetchEndTime() {
    let endTime;

  try {
    endTime = await AsyncStorage.getItem(persistentKeys.endTimeKey);
    if (!endTime) {
      //create a new time at 8 PM
      endTime = new Date();
      endTime.setHours(20, 0, 0, 0);
    } else {
      endTime = new Date(endTime);
    }
  } catch {
    console.log("error retrieving end date", error);
    return new Date(); // Fallback: Return current time
  }

  return new Date(endTime);
}

//save time values locally (to phone)
async function saveTime(time, key) {
  try {
    await AsyncStorage.setItem(key, time.toISOString())
  } catch(error) {
    console.log("Error saving data", error)
  }
}

export default function Settings() {
  const [username, setUsername] = useState('Loading...');
  const [password, setPassword] = useState('password');
  const [securityQuestion, setSecurityQuestion] = useState('Your favorite color?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const[loading, setLoading] = useState(false);
  const[stayLoggedIn, setStayLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  //fetch dates
  const [startTime, setStartTime] = useState(null); // State for start time
  const [endTime, setEndTime] = useState(null); // State for end time
  const [randomTime, setRandomTime] = useState(null); // State for random time

  // Picker visibility states
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    async function loadTimes() {
      try {
          const fetchedStartTime = await fetchStartTime();
          const fetchedEndTime = await fetchEndTime();
          const fetchedRandomTime = await getRandomTime();
          setStartTime(new Date(fetchedStartTime));
          setEndTime(new Date(fetchedEndTime));
          setRandomTime(new Date(fetchedRandomTime));
        } catch (error) {
          console.error("Error fetching times:", error);
      }
    }
    loadTimes();
  }, []); // Runs only when the component mounts

  //fetch usernmae from firestore using UID expo go
  useEffect(() =>{
    async function fetchUsername() {
      try{
        const user = auth.currentUser;
        if(user){
          const userDocRef = doc(db,'users',user.uid);
          const userDoc = await getDoc(userDocRef);
          //const userDoc = await getDoc(doc(db,'users',user.uid));
          if(userDoc.exists()){
            setUsername(userDoc.data().username);
          }else{
            console.log('No user data found in firestore');
            setUsername('User not found');
          }
        }else{
          console.log('No authenticated user');
          setUsername('Guest');
        }
      }catch(error){
        console.error('Error fetching username: ', error);
        setUsername('Error loading username');
      }
    }
    fetchUsername();
  },[]);

  //Function to update usernmae in firestore expo go
  const updateUsername = async () => {
    try{
      const userId = auth.currentUser?.uid;
      if(!userId) return;

      //await updateDoc(doc(db,'users',userId),{
      //  username:username,
      //});
      const userDocRef = doc(db,'users', userId);
      await updateDoc(userDocRef, {username});
      Alert.alert('Success!','Username successfully updated!');
    }catch(error){
      console.error('Error updating username: ', error);
      Alert.alert('Error', "Failed to update username");
    }
  };

  // Handlers for DateTimePicker
  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartPicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
      saveTime(selectedTime, persistentKeys.startTimeKey);
      scheduleDailyNotification();
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndPicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
      saveTime(selectedTime, persistentKeys.endTimeKey);
      scheduleDailyNotification();
    }
  };

  // Load stayLoggedIn value from AsyncStorage in expo go
  useEffect(() => {
    const loadStayLoggedIn = async () => {
      try {
        const value = await AsyncStorage.getItem('stayLoggedIn');
        if (value !== null) {
          setStayLoggedIn(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error loading stayLoggedIn value: ', error);
      }
    };
    loadStayLoggedIn();
  }, []);

  // Function to handle logout in expo go
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('stayLoggedIn');
      console.log('User logged out and stayLoggedIn removed');
      navigation.replace('welcome');
    } catch (error) {
      console.error('Logout error: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle stayLoggedIn state and save it to AsyncStorage in expo go
  const toggleStayLoggedIn = async (value) => {
    setStayLoggedIn(value);
    await AsyncStorage.setItem('stayLoggedIn', JSON.stringify(value));
  };


  //if the times have yet to be fetched, display a loading view
  if (!startTime || !endTime || !randomTime) {
    return <Text>Loading settings...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Account Settings</Text>
      
      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput 
          style={styles.input} 
          value={username} 
          onChangeText={setUsername} 
          placeholder="Enter username" 
        />
      </View>
      <Button title="Save Username" onPress={updateUsername}/>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Enter password" 
          secureTextEntry
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Security Question</Text>
        <TextInput 
          style={styles.input} 
          value={securityQuestion} 
          onChangeText={setSecurityQuestion} 
          placeholder="Security question" 
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Security Answer</Text>
        <TextInput 
          style={styles.input} 
          value={securityAnswer} 
          onChangeText={setSecurityAnswer} 
          placeholder="Enter answer" 
        />
      </View>

      {/* Time Pickers */}
      <View>
        <Text>From</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.timeText}>
            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker 
            display="default" 
            mode="time" 
            value={startTime} 
            onChange={handleStartTimeChange}
          />
        )}

        <Text>Until</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.timeText}>
            {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker 
            display="default" 
            mode="time" 
            value={endTime} 
            onChange={handleEndTimeChange}
          />
        )}
      </View>

      <View style={styles.switchField}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch 
          value={notificationsEnabled} 
          onValueChange={() => {
            setNotificationsEnabled(notificationsEnabled); 
            notificationsEnabled ? scheduleDailyNotification() : disableNotifications();
          }} 
        />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1E90FF',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});