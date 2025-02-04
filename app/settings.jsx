import { Text, Button } from 'react-native'
import React, { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import { persistentKeys } from '../constants/persistenceKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomTime } from './notifications';

//fetch start time value stored on phone
async function fetchStartTime() {
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
async function fetchEndTime() {
  let endTime;

  try {
    endTime = await AsyncStorage.getItem(persistentKeys.endTimeKey);
    console.log(endTime.toString())
    if (!endTime) {
      console.log("Called")
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
    console.log("Saving", time);
    await AsyncStorage.setItem(key, time.toISOString())
  } catch(error) {
    console.log("Error saving data", error)
  }
}

export default function Settings({navigation}) {

  //fetch dates
  const [startTime, setStartTime] = useState(null); // State for start time
  const [endTime, setEndTime] = useState(null); // State for end time

  useEffect(() => {
    async function loadTimes() {
        try {
            const fetchedStartTime = await fetchStartTime();
            const fetchedEndTime = await fetchEndTime();
            
            setStartTime(new Date(fetchedStartTime)); // Convert stored values to Date
            setEndTime(new Date(fetchedEndTime));
        } catch (error) {
            console.error("Error fetching times:", error);
        }
    }

    loadTimes();
  }, []); // Runs only when the component mounts

  //if the times have yet to be fetched, display a loading view
  if (!startTime || !endTime) {
    return <Text>Loading settings...</Text>;
  }

  const randomTime = getRandomTime(startTime, endTime); //calculate random time to be notified
  
  return(
    <SafeAreaView>
      <Button title='Back' onPress={() => {
        //TODO: update notification time using the random value
        saveTime(startTime, persistentKeys.startTimeKey);
        saveTime(endTime, persistentKeys.endTimeKey);
        navigation.goBack();
        }} />
        
      <Text>From</Text>
      <DateTimePicker display='default' mode='time' value={startTime} onChange={(event, time) => {setStartTime(time)}}/> 
      <Text>Until</Text>
      <DateTimePicker display='default' mode='time' value={endTime} onChange={(event, time) => {setEndTime(time)}}/>

      <Text>Random notification time: {randomTime.getHours()} : {randomTime.getMinutes()}</Text>
      <Text>start time hours: {startTime.getHours()}, end time hours: {endTime.getHours()}</Text>
    </SafeAreaView>
  ) //the final two text elements should be deleted, only displayed on screen for development purposes
}