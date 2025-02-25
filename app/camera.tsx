import { useEffect, useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { Button, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

class CameraModel {
    private flashMode: FlashMode;
    private cameraFacing: CameraType;
    private prompt: string;
    private photoUri: string;

    constructor() {
        this.flashMode = 'off';
        this.cameraFacing = 'back';
        this.prompt = '';
        this.photoUri = '';
    }

    setFlashMode(flashMode: FlashMode) {
        this.flashMode = flashMode;
    }

    setCameraFacing(facing: CameraType) {
        this.cameraFacing = facing;
    }

    setPhotoUri(uri: string) {
        this.photoUri = uri;
    }
    
    setPrompt(prompt: string) {
        this.prompt = prompt;
    }

    getFlashMode(): FlashMode {
        return this.flashMode;
    }

    getCameraFacing(): CameraType {
        return this.cameraFacing;
    }

    getPrompt(): string {
        return this.prompt;
    }
} // end camera model

//controller
class CameraContoller {
    private static model: CameraModel = new CameraModel();

    constructor() {
        this.fetchPrompt();
    }

    async fetchPrompt() {
        try {
            const prompt = await AsyncStorage.getItem("dailyPrompt") || "";
            CameraContoller.model.setPrompt(prompt);
        } catch (error) {
            console.error("Error fetching prompt: ", error)
        }
    }

    toggleCameraFacing(setFacing: Function, current: string) {
        if (current === 'back') {
            setFacing('front');
            CameraContoller.model.setCameraFacing('front');
        } else {
            setFacing('back');
            CameraContoller.model.setCameraFacing('back');
        }
        // setFacing(current => (current === 'back' ? 'front' : 'back'));
      }

    toggleFlashMode(setFlashMode: Function, flashMode: FlashMode) {
        const modes: Array<FlashMode> = ['off', 'auto', 'on'];
        var currentMode = modes.indexOf(flashMode);
        const newMode = modes[++currentMode % 3]

        setFlashMode(newMode);
        CameraContoller.model.setFlashMode(newMode);
    }

    async takePhoto(ref: React.RefObject<CameraView>) {
        const photo = await ref.current?.takePictureAsync();

        //if photo is defined, save photo
        if (photo) {
            CameraContoller.model.setPhotoUri(photo.uri);
            //upload photo to database here
        } else {
            console.error("Photo cannot be saved, photo is undefined")
        }
    }

    getPrompt(): string {
        return CameraContoller.model.getPrompt();
    }
} // end controller

//view
export default function Camera() {
    const controller: CameraContoller = new CameraContoller();

    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const ref = useRef<CameraView>(null);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        async function fetchPrompt() {
            await controller.fetchPrompt();
            const prompt = controller.getPrompt();
            setPrompt(prompt);
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

    const size: number = 32;

    return (
        <CameraView facing={facing} style={styles.camera}>
            <Text style={styles.prompt}>Daily prompt: {controller.getPrompt()}</Text>
            <TouchableOpacity id="cameraReverse" onPress={() => controller.toggleCameraFacing(setFacing, facing)}>
                <Ionicons name="camera-reverse-outline" size={size} style={styles.button}/>
            </TouchableOpacity>        
            <TouchableOpacity id="flash" onPress={() => controller.toggleFlashMode(setFlashMode, flashMode)}>
                <Ionicons name={flashMode == 'off' ? 'flash-off-outline' : 'flash-outline'} size={size} style={styles.button}/> 
            </TouchableOpacity>
            <TouchableOpacity id="shutter" onPress={() => controller.takePhoto(ref)}>
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