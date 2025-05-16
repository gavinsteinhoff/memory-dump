import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CameraMode,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Camera() {
  const cameraRef = useRef<CameraView>(null);
  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
  });

  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [isRecordingDone, setIsRecordingDone] = useState<boolean>(false);

  const [cameraPerm, requestCameraPerm] = useCameraPermissions();
  const [micPerm, requestMicPerm] = useMicrophonePermissions();
  const [mediaPerm, requestMediaPerm] = MediaLibrary.usePermissions();

  const recordingPromiseRef = useRef<Promise<
    { uri: string } | undefined
  > | null>(null);

  useEffect(() => {
    const backAction = () => {
      if (image !== null) {
        setImage(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [image]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraMode !== "picture") {
      setCameraMode("picture");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const cameraCapturedPicture = await cameraRef.current?.takePictureAsync();
    if (cameraCapturedPicture === undefined) {
      return;
    }

    setIsRecordingDone(false);
    setImage(cameraCapturedPicture.uri);
  }

  async function startRecording() {
    try {
      if (cameraMode !== "video") {
        setCameraMode("video");
        // Wait for the camera mode to change before proceeding
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setImage(null);
      setIsRecordingDone(false);
      const recordingRef = cameraRef.current?.recordAsync();
      if (recordingRef) {
        recordingPromiseRef.current = recordingRef;
      }
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  }

  async function stopRecording() {
    try {
      if (cameraMode !== "video") {
        return;
      }

      cameraRef.current?.stopRecording();
      if (recordingPromiseRef.current) {
        const videoResult = await recordingPromiseRef.current;
        if (videoResult && videoResult.uri) {
          setVideo(videoResult.uri);
          await player.replaceAsync(videoResult.uri);
          player.play();
          setIsRecordingDone(true);
        }
      }
    } catch (error) {
      console.error("Error stopping video recording:", error);
    } finally {
      recordingPromiseRef.current = null;
    }
  }

  function toggleCameraFlash() {
    setFlash((current) => (current === "off" ? "on" : "off"));
  }

  function toggleCameraMode() {
    setCameraMode((current) => (current === "picture" ? "video" : "picture"));
  }

  function deletePicture() {
    setImage(null);
    setIsRecordingDone(false);
  }

  function submitPicture() {
    setImage(null);
    setIsRecordingDone(false);
  }

  async function savePicture() {
    if (mediaPerm !== null && mediaPerm.status !== "granted") {
      await requestMediaPerm();
    }

    const mediaUri = isRecordingDone ? video : image;
    if (mediaUri !== null) {
      await MediaLibrary.saveToLibraryAsync(mediaUri);
    }
  }

  if (!cameraPerm || !micPerm) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPerm.granted || !micPerm.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestCameraPerm} title="grant permission" />
        <Button onPress={requestMicPerm} title="grant microphone permission" />
      </View>
    );
  }

  if (image !== null || isRecordingDone) {
    return (
      <View style={styles.container}>
        {isRecordingDone ? (
          <VideoView
            style={styles.image}
            contentFit="contain"
            nativeControls={false}
            player={player}
          />
        ) : (
          <Image style={styles.image} contentFit="contain" source={image} />
        )}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={deletePicture}>
            <MaterialIcons name="delete" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.button} onPress={submitPicture}>
            <MaterialIcons name="done" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.button} onPress={savePicture}>
            <MaterialIcons name="save-alt" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        animateShutter={false}
        facing={facing}
        flash={flash}
        mode={cameraMode}
        ratio={cameraMode === "picture" ? "4:3" : "16:9"}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={24} color="white" />
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={takePicture}
            onLongPress={startRecording}
            onPressOut={stopRecording}
          >
            <MaterialIcons name="camera" size={32} color="white" />
          </Pressable>
          <Pressable style={styles.button} onPress={toggleCameraFlash}>
            {flash === "on" ? (
              <MaterialIcons name="flash-on" size={24} color="white" />
            ) : (
              <MaterialIcons name="flash-off" size={24} color="white" />
            )}
          </Pressable>
        </View>
        <Pressable style={styles.cameraSwitch} onPress={toggleCameraMode}>
          <View
            style={
              cameraMode === "video"
                ? [styles.cameraSwitchItem, styles.active]
                : styles.cameraSwitchItem
            }
          >
            <MaterialIcons name="videocam" size={24} color="white" />
          </View>
          <View
            style={
              cameraMode === "picture"
                ? [styles.cameraSwitchItem, styles.active]
                : styles.cameraSwitchItem
            }
          >
            <MaterialIcons name="photo-camera" size={24} color="white" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  image: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: "column",
    paddingBottom: 30,
    paddingTop: 20,
  },
  buttonRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraSwitch: {
    flexDirection: "row",
    alignSelf: "center",
    width: 100,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
  },
  cameraSwitchItem: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  active: {
    backgroundColor: "rgba(100, 100, 255, 1)",
    borderRadius: "50%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
