import { Text, Button } from 'react-native'
import React, { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import { persistentKeys } from '../constants/persistenceKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';

// returns Date object with a random minute and hour value
// use to determine a random time to deliver notification to user
// accepts two parameters of type Date
function getRandomTime(startTime, endTime) { 

  // get the total amount of minutes elapsed (since midnight) of the selected start and end times
  let totalstartTimeMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  let totalEndDateMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  let randomMinutes;

  // the ELSE clause in this logic handles the case where the user may enter a start time
  // to allow notifications that is later than the end time. This means the time has to wrap
  // around the clock, passing through midnight
  if (totalstartTimeMinutes < totalEndDateMinutes) {
    randomMinutes = Math.random() * (totalEndDateMinutes - totalstartTimeMinutes) + totalstartTimeMinutes;
  } else {
    randomMinutes = Math.random() * (1440 - (totalstartTimeMinutes - totalEndDateMinutes)) + totalstartTimeMinutes;
  }
  
  // this result is the random time to deliver a notification
  let randomTime = new Date();
  randomTime.setHours(0);
  randomTime.setMinutes(randomMinutes);

  return randomTime;
}

//fetch time values stored on phone
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

  if (!startTime || !endTime) {
    return <Text>Loading settings...</Text>;
}

  const randomTime = getRandomTime(startTime, endTime);
  
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

      <Text>{randomTime.getHours()} : {randomTime.getMinutes()}</Text>
      <Text>{startTime.getHours()}, {endTime.getHours()}</Text>
    </SafeAreaView>
  ) //the final two text elements should be deleted, only displayed on screen for development purposes
}