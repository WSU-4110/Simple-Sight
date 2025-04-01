import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { fetchStartTime, fetchEndTime } from './settings';
import { registerBackgroundNotificationScheduler } from '../utils/backgroundTask';

export async function requestPermissions() {
    const { status } = await Notifications.getPermissionsAsync(); //retunrs current status of notification permissions
    console.log(status)
    if (status !== 'granted') {
        status = await Notifications.requestPermissionsAsync();

        if (status === 'granted') {    
            scheduleDailyNotification();
        } else {
            Alert.alert('Permission Required', 'Please enable notifications in settings.');
            return;
        }
    }

    //define settings for notification handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

export async function scheduleDailyNotification() { 
    const randTime = await getRandomTime(); //get random time to be used in the notification

    await Notifications.cancelAllScheduledNotificationsAsync(); // Prevent duplicates
    const storedPrompt = await AsyncStorage.getItem("dailyPrompt");

    //schedule notificaiton
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Take a second to be in the moment",
            body: storedPrompt,
            sound: true, //plays sound and vibrates device (if device isnt silent)
            data: {screen: "Camera"}
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: randTime.getHours(), 
            minute: randTime.getMinutes(), 
            repeats: false, 
        },
    });

    // add background event to wait until after the notification has delivered to schedule the next one
    await registerBackgroundNotificationScheduler();
}

export async function scheduleNotificationNow() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Simple Sight",
            body: "Simple Sight says hello!",
            sound: true, //plays sound and vibrates device (if device isnt silent)
            data: { screen: "Camera" },
        },
        trigger: {
            //type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
            repeats: false,
        }
    });
}

export async function disableNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
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

  export default function func() {
    //this function to silence warning about this file having no default export
    //do not add anything here
  }