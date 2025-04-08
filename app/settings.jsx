import { View, Text, StyleSheet, TextInput, Switch, ScrollView, TouchableOpacity, Button, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { persistentKeys } from '../constants/persistenceKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { disableNotifications, getRandomTime, scheduleDailyNotification } from './notifications';
import { auth, db } from './firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from 'expo-router';

// fetch saved start time
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
    return new Date();
  }
  return new Date(startTime);
}

// fetch saved end time
export async function fetchEndTime() {
  let endTime;
  try {
    endTime = await AsyncStorage.getItem(persistentKeys.endTimeKey);
    if (!endTime) {
      endTime = new Date();
      endTime.setHours(20, 0, 0, 0);
    } else {
      endTime = new Date(endTime);
    }
  } catch {
    return new Date();
  }
  return new Date(endTime);
}

// save time to storage
async function saveTime(time, key) {
  try {
    await AsyncStorage.setItem(key, time.toISOString());
  } catch (error) {
    console.log("Error saving data", error);
  }
}

export default function Settings() {
  const [username, setUsername] = useState('Loading...');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // toggle state
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [randomTime, setRandomTime] = useState(null);

  const [showStartPicker, setShowStartPicker] = useState(true);
  const [showEndPicker, setShowEndPicker] = useState(true);

  // Load saved times
  useEffect(() => {
    async function loadTimes() {
      const fetchedStartTime = await fetchStartTime();
      const fetchedEndTime = await fetchEndTime();
      const fetchedRandomTime = await getRandomTime();
      setStartTime(new Date(fetchedStartTime));
      setEndTime(new Date(fetchedEndTime));
      setRandomTime(new Date(fetchedRandomTime));
    }
    loadTimes();
  }, []);

  // load saved toggle state
  useEffect(() => {
    const loadToggle = async () => {
      const stored = await AsyncStorage.getItem('notificationsEnabled');
      if (stored !== null) {
        setNotificationsEnabled(JSON.parse(stored));
      }
    };
    loadToggle();
  }, []);

  // load username from Firebase
  useEffect(() => {
    const loadUsernameFromStorage = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    loadUsernameFromStorage();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const fetchedUsername = userDoc.data().username || "User";
          setUsername(fetchedUsername);
          await AsyncStorage.setItem("username", fetchedUsername);
        } else {
          setUsername("User not found");
        }
      } else {
        setUsername("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUsername = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { username });
      Alert.alert('Success!', 'Username updated!');
    } catch (error) {
      Alert.alert('Error', "Update failed");
    }
  };

  // set notification time window
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

  // load login persistence toggle
  useEffect(() => {
    const loadStayLoggedIn = async () => {
      const value = await AsyncStorage.getItem('stayLoggedIn');
      if (value !== null) {
        setStayLoggedIn(JSON.parse(value));
      }
    };
    loadStayLoggedIn();
  }, []);

  // log out and clear stored values
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("username");
      await AsyncStorage.removeItem("stayLoggedIn");
      navigation.replace("welcome");
    } catch (error) {
      console.error("Logout error: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Save login toggle to storage
  const toggleStayLoggedIn = async (value) => {
    setStayLoggedIn(value);
    await AsyncStorage.setItem('stayLoggedIn', JSON.stringify(value));
  };

  if (!startTime || !endTime || !randomTime) {
    return <Text>Loading settings...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Account Settings</Text>

      {/* Username */}
      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor={'gray'}
        />
      </View>
      <Button title="Save Username" onPress={updateUsername} />

      {/* Notification time window */}
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

      {/* FIXED NOTIFICATION TOGGLE */}
      <View style={styles.switchField}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          //Fixed: now uses passed value and saves it
          onValueChange={async (value) => {
            setNotificationsEnabled(value);
            await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
            if (value) {
              scheduleDailyNotification();
            } else {
              disableNotifications();
            }
          }}
        />
      </View>

      {/* Logout */}
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
