import { useEffect, useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { Button, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const ref = useRef<CameraView>(null);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        async function fetchPrompt() {
            try {
                const prompt = await AsyncStorage.getItem("dailyPrompt") || "";
                setPrompt(prompt);
            } catch (error) {

            }
        }
        fetchPrompt();
    }, [])

    if (!permission || !prompt) {
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

    const size: number = 32;

    return (
        <CameraView facing={facing} style={styles.camera}>
            <Text style={styles.prompt}>Daily prompt: {prompt}</Text>
            <TouchableOpacity id="cameraReverse" onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse-outline" size={size} style={styles.button}/>
            </TouchableOpacity>        
            <TouchableOpacity id="flash" onPress={toggleFlashMode}>
                <Ionicons name={flashMode == 'off' ? 'flash-off-outline' : 'flash-outline'} size={size} style={styles.button}/> 
            </TouchableOpacity>
            <TouchableOpacity id="shutter" onPress={takePhoto}>
                <Ionicons name="ellipse-outline" size={size*3} style={styles.cameraButton}/> 
            </TouchableOpacity>
        </CameraView>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
    prompt: {
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontSize: 18,
        padding: 5,
    },
    button: {
        color: 'white',
        padding: 9,
        marginLeft: 'auto',
        marginRight: 2,
    },
    cameraButton: {
        marginTop: '110%',
        color: 'white',
        margin: 'auto',
    }
})