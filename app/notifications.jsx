import * as Notifications from 'expo-notifications';
import { Alert, View, Text } from 'react-native';

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
