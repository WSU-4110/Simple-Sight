const { scheduleNotificationAsync, getAllScheduledNotificationsAsync, requestPermissionsAsync, getPermissionsAsync } = require('expo-notifications');
const { getRandomInt } = require('../utils/randomInt.jsx');

test('Test random int function used in random time generation', () => {
    const randNum = getRandomInt(0, 10);
    expect(randNum).toBeLessThanOrEqual(10);
    expect(randNum).toBeGreaterThanOrEqual(0);
});

test('Notifications can be enabled and permissions can be retrieved', async () => {
    const request = await requestPermissionsAsync();
    const permissions = await getPermissionsAsync();

    expect(request.granted === permissions.granted).toBeTruthy();
});

test('Notifications can be stored', async () => {

    //create notification
    const now = new Date();
    const notificationIdentifier = await scheduleNotificationAsync({
        content: {
            title: "Test notification",
            body: "Test notification",
        },
        trigger: {
            hour: now.getHours(),
            minute: now.getMinutes(), 
            repeats: false, 
        },
    });

    //mock the notification being added to the notificationRequest array
    await getAllScheduledNotificationsAsync.mockResolvedValue([notificationIdentifier]);

    const allNotifications = await getAllScheduledNotificationsAsync();

    expect(allNotifications).toEqual([notificationIdentifier]);
});