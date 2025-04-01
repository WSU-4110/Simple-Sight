// import * as TaskManager from 'expo-task-manager';
// import * as BackgroundFetch from 'expo-background-fetch';
import { scheduleDailyNotification } from '../app/notifications';
import { fetchEndTime } from '../app/settings';
import { defineTask, unregisterTaskAsync } from 'expo-task-manager';
import { getStatusAsync, Status, registerTaskAsync } from 'expo-background-fetch';

const BACKGROUND_TASK_NAME = "notificationScheduler";

// Define the background task
defineTask(BACKGROUND_TASK_NAME, async () => {

  // schedule notification
  scheduleDailyNotification();

  //ensure background task is unscheduled so it does not repeat
  await unregisterTaskAsync(BACKGROUND_TASK_NAME);
});

// Register the background task
export async function registerBackgroundNotificationScheduler() {
  const status = await getStatusAsync();
  if (status === Status.Restricted || status === Status.Denied) {
    console.log("Background execution is disabled");
    return;
  }

  let endTime = await fetchEndTime();
  let currentTime = new Date();
  let hoursRemaining = endTime.getHours() - currentTime.getHours();
  let minutesRemaining = endTime.getMinutes() - currentTime.getMinutes();

  await registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: hoursRemaining * 60 * 60 + minutesRemaining * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}