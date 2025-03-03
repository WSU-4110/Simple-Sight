import { CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CameraScreen() {
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
    if (ref.current) {
      const photo = await ref.current.takePictureAsync();
      if (photo?.uri) {
        setUri(photo.uri);
      }
    }
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
        <Pressable onPress={toggleFlashMode} style={styles.iconButton}>
          <Ionicons name={flashMode === 'off' ? 'flash-off-outline' : 'flash-outline'} size={iconSize} color="white" />
        </Pressable>
        <Pressable onPress={takePicture} style={styles.shutterBtn}>
        </Pressable>
        <Pressable onPress={toggleFacing} style={styles.iconButton}>
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
    bottom: 100,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 80,
  },
  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 50,
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