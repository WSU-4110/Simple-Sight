# Installation Guide

This guide will walk you through setting up and running Simple Sight project.

## Prerequisites

Ensure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## Clone the Repository

```sh
git clone https://github.com/WSU-4110/Simple-Sight
cd Simple-Sight
```

## Install Dependencies

Using npm:

```sh
npm install
```

Or using yarn:

```sh
yarn install
```

## Start the Development Server

```sh
npx expo start
```

This will launch the Expo Developer Tools, where you can run the app on an emulator or a physical device.

## Running on a Physical Device

- Install the [Expo Go](https://expo.dev/client) app on your Android or iOS device.
- Scan the QR code shown in the terminal or Expo Developer Tools.

## Running on an Emulator/Simulator

### Android:

- Ensure you have Android Studio installed with an AVD (Android Virtual Device) configured.
- Start the emulator and run:
  ```sh
  npx expo start --android
  ```

### iOS:

- macOS users can run the app on the iOS Simulator using:
  ```sh
  npx expo start --ios
  ```
  (Requires Xcode to be installed.)

## Building the App

For a production build, use:

```sh
npx expo prebuild
npx expo run:android  # For Android
npx expo run:ios  # For iOS (Mac only)
```

## Troubleshooting

If you encounter issues, try the following:

- Clear the cache:
  ```sh
  npx expo start --clear
  ```
- Ensure dependencies are up to date:
  ```sh
  npm install -g expo-cli
  ```
- Check the [Expo documentation](https://docs.expo.dev/)
