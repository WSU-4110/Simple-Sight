const { scheduleNotificationAsync, getAllScheduledNotificationsAsync, requestPermissionsAsync, getPermissionsAsync } = require('expo-notifications');
const { getRandomInt } = require('../utils/randomInt.jsx');
const { scheduleNotificationNow, getRandomTime } = require('../app/notifications.jsx');
const { start } = require('repl');

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

test('Notifications can be scheduled', async () => {
    const notificatinIdentifier = await scheduleNotificationNow();
    expect(notificatinIdentifier.length).toBeGreaterThan(0);
});

test('randomTime in valid range when wrapping around 24 hour clock', async () => {
    let startTime = new Date();
    startTime.setHours(12);
    startTime.setMinutes(9);
    
    let endTime = new Date();
    endTime.setHours(8);
    endTime.setMinutes(56);

    //ensure randomTime can wrap around 24 hour clock if start time set later than end time
    const randTime = await getRandomTime(startTime, endTime);
    let hoursFlag = 8 >= randTime.getHours() || randTime.getHours() >= 12;
    let minutesFlag = 9 <= randTime.getMinutes() <= 56;

    expect(hoursFlag).toBeTruthy();
    expect(minutesFlag).toBeTruthy();
});