import { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, View, Text } from "react-native";

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');

    if (!permission) {
        return(
            <View>
                <Text>Loading...</Text>
            </View>
        );
    } else if (!permission.granted) {
        return(
            <View>
                <Text>Please enable camera permissions to get the best experience using Simple Sight</Text>
                <Button title="Enable camera" onPress={requestPermission} />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
      }

    return (
        <CameraView facing={facing}>
            
        </CameraView>
    );
}

const styles = StyleSheet.create({
    camera: {

    },
})