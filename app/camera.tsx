import { CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from 'react-native-vector-icons/Ionicons';

  export default function Camera() {
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
    const modes: FlashMode[] = ['off', 'auto', 'on'];
    const currentMode = modes.indexOf(flashMode);
    const newMode = modes[(currentMode + 1) % modes.length];
    setFlashMode(newMode);
  };

  const uploadPhoto = async () => {
    // Upload photo logic here
  };

  const renderPicture = () => (
    <View style={styles.previewContainer}>
      <Image
        source={{ uri }}
        contentFit="contain"
        style={styles.previewImage}
      />
      <View style={styles.previewOptions}>
        <TouchableOpacity onPress={() => setUri(undefined)} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadPhoto} style={styles.saveButton}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCamera = () => (
    <CameraView
      ref={ref}
      style={styles.camera}
      mode="picture"
      facing={facing}
      flash={flashMode}
      onCameraReady={() => console.log("Camera is ready")}
    >
      <View style={styles.shutterContainer}>
        <Pressable onPress={toggleFlashMode}>
          <Ionicons name={flashMode === 'off' ? 'flash-off-outline' : 'flash-outline'} size={iconSize} color="white" />
        </Pressable>
        <Pressable onPress={takePicture} style={styles.shutterBtn}>
          <Ionicons name="ellipse-outline" size={iconSize * 3} color="white" />
        </Pressable>
        <Pressable onPress={toggleFacing}>
          <Ionicons name="camera-reverse-outline" size={iconSize} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );

  return <View style={styles.container}>{uri ? renderPicture() : renderCamera()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  previewImage: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
  },
  previewOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
});