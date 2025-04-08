import { CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage,db } from "./firebaseconfig";
import PromptContainer from './promptContainer';
import { colors } from '@/constants/colors'
import { useIsFocused } from "@react-navigation/native";
import { doc, getDoc,addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

  export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | undefined>(undefined);
    const [facing, setFacing] = useState<CameraType>("back");
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const iconSize: number = 32;
    const isFocused = useIsFocused();
   

    if (!permission) {
      requestPermission()
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

      if (!photo) {
        alert("Photo not saved, try again.");
        return;
      }

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
    if (!uri) return;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if(!user){
        alert("User not authenticated");
        return;
      }
      //Fetch username from firestore
      const userDocRef = doc(db,"users",user.uid);
      const userDoc = await getDoc(userDocRef);
      const username = userDoc.exists() ? userDoc.data().username : "Anonymous";

      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `photos/${Date.now()}.jpg`;
      const fileRef = storageRef(storage, filename);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      //save url,date,username to firestore when uploading photo
      await addDoc(collection(db,"photos"),{
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
        userId: user.uid,
        username: username,

      });

      console.log("Uploaded successfully: ", downloadURL);
      setUri(undefined);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    }
  };

  const renderPicture = () => (
    <View style={styles.previewContainer}>
      <Image source={{ uri }} contentFit="contain" style={styles.previewImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setUri(undefined)} style={styles.deleteButton}>
          <Text style={{fontSize: 30}}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadPhoto} style={styles.saveButton}>
          <Text style={{fontSize: 30}}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCamera = () => (isFocused ?
    <CameraView
      ref={ref}
      style={styles.camera}
      mode="picture"
      facing={facing}
      flash={flashMode}
    >
      <View style={styles.promptContainer}>
        <PromptContainer/>
      </View>

      <View style={styles.shutterContainer}>
        <Pressable onPress={toggleFlashMode} style={styles.iconButton}>
          <Ionicons name={flashMode === 'off' ? 'flash-off-outline' : 'flash-outline'} size={iconSize} color="white" />
          <Text style={{color: 'white', padding: 5}}>{flashMode.charAt(0).toUpperCase() + flashMode.substring(1)}</Text>
        </Pressable>
        <Pressable onPress={takePicture} style={styles.shutterBtn} />
        <Pressable onPress={toggleFacing} style={styles.iconButton}>
          <Ionicons name="camera-reverse-outline" size={iconSize} color="white" />
        </Pressable>
      </View>
    </CameraView>
    : null
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
  promptContainer: {
    backgroundColor: colors.prmoptContainerBackground,
    paddingTop: '15%',
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
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  previewImage: {
    height: "100%",
    borderRadius: 10,
    aspectRatio: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 0,
    marginBottom: 60,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: "red",
    width: '50%',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    fontSize: 300,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: "green", 
    width: '50%',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  
});
