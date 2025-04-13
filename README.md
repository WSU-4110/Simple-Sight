# Simple Sight #

Encouraging Mindfulness Through Daily Moments
Simple Sight is a mobile app designed to promote mindfulness by encouraging users to capture and appreciate real-life moments. Unlike traditional social media, Simple Sight focuses on authentic experiences rather than curated content.

![EAS Build](https://github.com/WSU-4110/Simple-Sight/actions/workflows/eas-build.yml/badge.svg)

## Features ##

**Daily Prompts**
Receive a daily notification reminding you to take a photo of your present moment.

**Capture & Share**
Take a photo of what you’re doing or experiencing right now.
Share your moment with others on the app.

**View Past Moments**
Revisit your previous photos to reflect on times you embraced mindfulness.

**Cross-Platform Compatibility**
Available for both iOS and Android using React Native.

### Important: Enable Notifications ###

To get the full experience of Simple Sight, make sure to enable notifications on your device. This allows the app to send daily reminders to capture and appreciate a mindful moment.

#### How to Enable Notifications ####
**iOS:** Go to Settings → Notifications → Simple Sight and enable alerts.

**Android:** Go to Settings → Apps & notifications → Simple Sight and turn on notifications.

## Installation ##
Clone the repository and install dependencies:

```bash 
git clone https://github.com/WSU-4110/Simple-Sight
cd SimpleSight
npm install
npm install -g expo-cli
```
**For iOS (requires Mac):** ```bash npx expo run:ios ```
**For Android:** ```Bash npx expo run:android ```

## Technologies Used ##
React Native – Cross-platform development (iOS, Android)

AsyncStorage – Persistent storage of user preferences and data

Expo – Simplifies setup and development

Expo Notifications – Sends daily prompts

Expo Camera - Allows users to capture daily moments

Firebase - User authentication 

Firestore - Cloud storage of user-captured photos

## License ##
This project is open-source under the MIT License.
