# Welcome to AquaGuard

This application is a community based water source mapping and quality reporting mobile application aimed to increase
the water quality and to help users to find water sources and their status.

## Project Setup (Windows)

**1. Download and configure Android Studio.**

- While we won't use android studio to build the app, we will use it as a package manager to install all the relevant
  dependencies to build the project.
- Download Android Studio from [here](https://developer.android.com/studio).
- After install android studio with default settings, open it and click on the "SDK Manager" button in the top right
  corner of the window.
- In the SDK Manager window, click on the "SDK Tools" tab and install the following packages:
    - Under the SDK Platform: *(Tick 'show package details' in the bottom right corner to reveal versions)*
        - Android API 35 (Android SDK Platform 35, Sources for Android 35)
    - Under the SDK Tools: *(Tick 'show package details' in the bottom right corner to reveal versions)*
        - Android SDK Build-Tools 35.0.0
        - NDK (Side by side) 26.1.10909125
    - Android SDK Command-line Tools (latest)
    - CMake (3.22.1)
    - Android Emulator (34.2.16)
    - Android SDK Platform-Tools (35.0.2)

**2. Install dependencies**

   ```bash
   npm install
   ```

**2. Install react native firebase modules**

  ```bash
  npm install @react-native-firebase/app
  ```

**3. Install Authentication and Crashlytics modules**

  ```bash
  npm install @react-native-firebase/auth
  npm install @react-native-firebase/crashlytics
  ```

**4. Install other dependencies**

   ```bash
    npx expo install expo-camera
   ```

**5. Install expo-dev-client**

   ```bash
    npx expo install expo-dev-client
   ```

**6. Connect your android device and start the app**

   ```bash
    npx expo run:android
   ```

