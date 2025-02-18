import { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { Button, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const ref = useRef<CameraView>(null);

    if (!permission) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    } else if (!permission.granted) {
        return (
            <View>
                <Text>Please enable camera permissions to get the best experience using Simple Sight</Text>
                <Button title="Enable camera" onPress={requestPermission} />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
      }

    function toggleFlashMode() {
        const modes: Array<FlashMode> = ['off', 'auto', 'on'];
        var currentMode = modes.indexOf(flashMode);

        setFlashMode(modes[++currentMode % 3]);
    }

    async function takePhoto() {
        const photo = await ref.current?.takePictureAsync();
    }

    const size: number = 24;

    return (
        <CameraView facing={facing}>
            <TouchableOpacity id="cameraReverse" className="cameraControl">
                <Ionicons name="camera-reverse-outline" size={size} />
            </TouchableOpacity>        
            <TouchableOpacity id="flash" className="cameraControl" onPress={toggleFlashMode}>
                <Ionicons name={flashMode == 'off' ? 'flash-off-outline' : 'flash-outline'} size={size} /> 
            </TouchableOpacity>
            <TouchableOpacity id="shutter" className="cameraControl" onPress={takePhoto}>
                <Ionicons name="ellipse-outline" size={48} /> 
            </TouchableOpacity>
        </CameraView>
    );
}

const styles = StyleSheet.create({
    camera: {

    },
    cameraControl: {
        
    },
})