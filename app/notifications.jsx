import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { fetchStartTime, fetchEndTime } from './settings';

export async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please enable notifications in settings.');
        return;
    }
    //console.log('Notification permissions granted.');
    
    //define settings for notification handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
    
    scheduleDailyNotification();
}

export async function scheduleDailyNotification() { 
    //this function needs to be set differently
    //TODO: allow users to choose a notification time range and
    //each day, randomly set the notification time somewhere in that range
    const randTime = getRandomTime();

    await Notifications.cancelAllScheduledNotificationsAsync(); // Prevent duplicates

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's Time ⏰",
            body: "Take a second to be in the moment",
            sound: true, //plays sound and vibrates device (if device isnt silent)
        },
        trigger: {
            hour: randTime.getHours(), 
            minute: randTime.getMinutes(), 
            repeats: false, 
        },
    });

    //wait until randtime hours and minutes + the time remaining until the end time to schedule the next one
    Notifications.addNotificationReceivedListener(notification => {
        
    })
}

// returns Date object with a random minute and hour value
// use to determine a random time to deliver notification to user
// accepts two parameters of type Date
export async function getRandomTime() { 
    let startTime = await fetchStartTime();
    let endTime = await fetchEndTime();

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