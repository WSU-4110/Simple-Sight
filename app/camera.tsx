import { CameraMode, CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
  import { useRef, useState } from "react";
  import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
  import { Image } from "expo-image";
  import Ionicons from 'react-native-vector-icons/Ionicons';
import { name } from '../node_modules/ci-info/index.d';

  export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | undefined>(undefined);
    const [facing, setFacing] = useState<CameraType>("back");
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const iconSize: number = 32;
  
    if (!permission) {
      return null;
    }
  
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to use the camera
          </Text>
          <Button onPress={requestPermission} title="Grant permission" />
        </View>
      );
    }
  
    const takePicture = async () => {
      const photo = await ref.current?.takePictureAsync();
      setUri(photo?.uri);
    };
  
    const toggleFacing = () => {
      setFacing((prev) => (prev === "back" ? "front" : "back"));
    };

    const toggleFlashMode = () => {
        const modes: Array<FlashMode> = ['off', 'auto', 'on'];
        var currentMode = modes.indexOf(flashMode);
        const newMode = modes[++currentMode % 3]

        setFlashMode(newMode);
    }

    async function uploadPhoto() {
        //upload photo
    }
  
    const renderPicture = () => {
      return (
        <View>
          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ flex: 1, aspectRatio: 1 }}
          />
          <View id="previewOptions">
            <TouchableOpacity onPress={() => setUri(undefined)} style={{ backgroundColor: 'red'}}>
                <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadPhoto} style={{ backgroundColor: 'green'}}>
                <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
  
    const renderCamera = () => {
      return (
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={'picture'}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
          flash={flashMode}
        >
          <View style={styles.shutterContainer}>
            <Pressable onPress={takePicture}>
                <Ionicons name="ellipse-outline" size={iconSize*3}/>
            </Pressable>
            <Pressable onPress={toggleFacing}>
                <Ionicons name="camera-reverse-outline" size={iconSize} />
            </Pressable>
            <Pressable onPress={toggleFlashMode}>
                <Ionicons name={flashMode == 'off' ? 'flash-off-outline' : 'flash-outline'} size={iconSize}/> 
            </Pressable>
          </View>
        </CameraView>
      );
    };
  
    return (
      <View style={styles.container}>
        {uri ? renderPicture() : renderCamera()}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    camera: {
      flex: 1,
      width: "100%",
    },
    shutterContainer: {
      position: "absolute",
      bottom: 44,
      left: 0,
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 30,
    },
    shutterBtn: {
      backgroundColor: "transparent",
      borderWidth: 5,
      borderColor: "white",
      width: 85,
      height: 85,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
    },
    shutterBtnInner: {
      width: 70,
      height: 70,
      borderRadius: 50,
    },
    previewOptions: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }
  });