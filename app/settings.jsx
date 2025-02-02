import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';

// returns Date object with a random minute and hour value
// use to determine a random time to deliver notification to user
// accepts two parameters of type Date
function getRandomTime(startDate, endDate) { 
  let totalStartDateMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  let totalEndDateMinutes = endDate.getHours() * 60 + endDate.getMinutes();

  let randomMinutes

  if (totalStartDateMinutes < totalEndDateMinutes) {
    randomMinutes = Math.random() * (totalEndDateMinutes - totalStartDateMinutes) + totalStartDateMinutes;
  } else {
    randomMinutes = Math.random() * (1440 - (totalStartDateMinutes - totalEndDateMinutes)) + totalStartDateMinutes;
  }
  
  let randomTime = new Date();
  randomTime.setHours(0);
  randomTime.setMinutes(randomMinutes);

  return randomTime;
}

export default function Settings({navigation}) {
  //change these variable values to be the time preferences the user chooses
  // (stored to device, not cloud)
  let startDate = new Date();
  let endDate = new Date();
  endDate.setHours(startDate.getHours() -5);
  endDate.setMinutes(startDate.getMinutes() -9);
  let randomDate = getRandomTime(startDate, endDate);

  return(
    <SafeAreaView>
      <Button title='Back' onPress={() => {navigation.navigate('home')}} />
      <Text>From</Text>
      <DateTimePicker display='default' mode='time' value={startDate} /> 
      <Text>Until</Text>
      <DateTimePicker display='default' mode='time' value={endDate} />
      <Text>{randomDate.getHours()} : {randomDate.getMinutes()}</Text>
    </SafeAreaView>
  )
}