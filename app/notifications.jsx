import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

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
            shouldSetBadge: false,
        }),
    });
    
    //schedule notifications
    scheduleDailyNotification();
}

export async function scheduleDailyNotification() { 
    //this function needs to be set differently
    //TODO: allow users to choose a notification time range and
    //each day, randomly set the notification time somewhere in that range

    await Notifications.cancelAllScheduledNotificationsAsync(); // Prevent duplicates

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's Time ⏰",
            body: "Take a second to be in the moment",
            sound: true, //plays sound and vibrates device (if device isnt silent)
        },
        trigger: {
            hour: 11,  // Change this to desired hour (24-hour format)
            minute: 51, // Change this to desired minute
            repeats: false, // Ensures it repeats daily
        },
    });

    //console.log("Daily notification scheduled!");
}

// returns Date object with a random minute and hour value
// use to determine a random time to deliver notification to user
// accepts two parameters of type Date
export function getRandomTime(startTime, endTime) { 

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