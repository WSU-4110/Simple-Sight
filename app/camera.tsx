import { View, Text, Button, StyleSheet, AppState } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useCameraPermission } from '../node_modules/react-native-vision-camera/src/hooks/useCameraPermission';
import { useCameraDevice } from '../node_modules/react-native-vision-camera/src/hooks/useCameraDevice';
import { Camera } from 'react-native-vision-camera/src/Camera';
import { useIsFocused } from '@react-navigation/native';
import { useCameraFormat } from '../node_modules/react-native-vision-camera/src/hooks/useCameraFormat';
import { Templates } from '../node_modules/react-native-vision-camera/src/devices/Templates';

export default function CameraView() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const isFocused = useIsFocused()
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        //upon mounting the app, add an event listener of the app's state
        const subscription = AppState.addEventListener('change', nextAppState => {
          setAppState(nextAppState);
        });
    
        // Cleanup listener on unmount
        return () => {
          subscription.remove(); 
        };
      }, []); 

    const isActive = isFocused && appState === "active"

    const device = useCameraDevice('back', {
        physicalDevices: [
          'ultra-wide-angle-camera',
          'wide-angle-camera',
          'telephoto-camera'
        ]
      });

    const format = useCameraFormat(device, Templates.Snapchat);

    if (device === undefined || device === null) {
        //if the device has no camera, return a view that notifieis them of this
        return (
            <View style={styles.noPermission}>
                <Text>Something went wrong</Text>
            </View>
        )
        
    } else if (!hasPermission) {
        //if the user does not enable camera permissions, return a view that requests them to enable them
        return (
            <View style={styles.noPermission}>
                <Text>Please enable camera permissions to use the camera</Text>
                <Button title='Enable permissions' onPress={requestPermission} />
            </View>
        )
    }

    return (
        <Camera style={styles.camera} device={device} isActive={true}/>
    )
}

const styles = StyleSheet.create({
    noPermission: {
        backgroundColor: 'black',
        fontSize: 20,
        padding: 20,
    },
    camera: {

    }
})