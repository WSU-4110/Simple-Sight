import { View, Text, StyleSheet, TextInput, Switch, ScrollView, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { persistentKeys } from '../constants/persistenceKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomTime, scheduleDailyNotification, scheduleNotificationNow } from './notifications';

//fetch start time value stored on phone
export async function fetchStartTime() {
  let startTime;

    try {
      startTime = await AsyncStorage.getItem(persistentKeys.startTimeKey);
      if (startTime === null) {
        //create a new time at 8 AM
        startTime = new Date();
        startTime.setHours(8, 0, 0, 0);
      } else {
        startTime = new Date(startTime);
      }
    } catch {
      console.log("error retrieving start date", error);
      return new Date(); // Fallback: Return current time
    }

  return new Date(startTime);
}

  //fetch end time stored on phone
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
  const [username, setUsername] = useState('YourUsername');
  const [password, setPassword] = useState('password');
  const [securityQuestion, setSecurityQuestion] = useState('Your favorite color?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  //fetch dates
  const [startTime, setStartTime] = useState(null); // State for start time
  const [endTime, setEndTime] = useState(null); // State for end time
  const [randomTime, setRandomTime] = useState(null); // State for random time

  useEffect(() => {
    async function loadTimes() {
      try {
          const fetchedStartTime = await fetchStartTime();
          const fetchedEndTime = await fetchEndTime();
          const fetchedRandomTime = await getRandomTime();
          
          setStartTime(new Date(fetchedStartTime)); // Convert stored values to Date
          setEndTime(new Date(fetchedEndTime));
          setRandomTime(new Date(fetchedRandomTime));
      } catch (error) {
          console.error("Error fetching times:", error);
      }
    }
    loadTimes();
  }, []); // Runs only when the component mounts

  //if the times have yet to be fetched, display a loading view
  if (!startTime || !endTime || !randomTime) {
    return <Text>Loading settings...</Text>;
  }

  // const randomTime = getRandomTime(); //calculate random time to be notified

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

      <View>
        <Text>From</Text>
        <DateTimePicker display='default' mode='time' value={startTime} onChange={(event, time) => {
          setStartTime(time); 
          saveTime(startTime, persistentKeys.startTimeKey);
          scheduleDailyNotification();
        }}/> 
        <Text>Until</Text>
        <DateTimePicker display='default' mode='time' value={endTime} onChange={(event, time) => {
          console.log("changed")
          setEndTime(time);
          saveTime(endTime, persistentKeys.endTimeKey);
          scheduleDailyNotification();
        }}/>
      </View>

      <View style={styles.switchField}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch 
          value={notificationsEnabled} 
          onValueChange={setNotificationsEnabled} 
        />
      </View>

      <Button title='schedule notification' onPress={ () => {scheduleNotificationNow()} } />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
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
});