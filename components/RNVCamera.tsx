import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useMicrophonePermission,
} from "react-native-vision-camera";

export default function RNVCamera() {
  const camera = useRef<Camera>(null);
  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
  });

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [cameraMode, setCameraMode] = useState<string>("picture");
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [video, setVideo] = useState<string | null>(null);

  const device = useCameraDevice(facing);
  const format = useCameraFormat(device, [{ photoAspectRatio: 16 / 9 }]);

  const { hasPermission, requestPermission } = useCameraPermission();
  const microphone = useMicrophonePermission();

  const Reset = useCallback(() => {
    player.pause();
    setImage(null);
    setVideo(null);
  }, [player]);

  useEffect(() => {
    const backAction = () => {
      if (image !== null || video !== null) {
        Reset();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [image, video, Reset]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function shortPress() {
    if (cameraMode === "picture") {
      takePicture();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  }

  async function takePicture() {
    setVideo(null);
    setIsRecording(false);
    const photo = await camera.current?.takePhoto({
      flash: flash,
    });
    if (photo) {
      setImage(`file://${photo.path}`);
    }
  }

  async function startRecording() {
    setImage(null);
    setIsRecording(true);
    camera.current?.startRecording({
      flash: flash,
      onRecordingFinished: async (video) => {
        setVideo(`file://${video.path}`);
        await player.replaceAsync(`file://${video.path}`);
        player.play();
      },
      onRecordingError: (error) => console.error(error),
    });
  }

  async function stopRecording() {
    await camera.current?.stopRecording();
    setIsRecording(false);
  }

  function toggleCameraFlash() {
    setFlash((current) => (current === "off" ? "on" : "off"));
  }

  function toggleCameraMode() {
    setCameraMode((current) => (current === "picture" ? "video" : "picture"));
  }

  function deletePicture() {
    Reset();
  }

  function submitPicture() {
    Reset();
  }

  if (!hasPermission || !microphone.hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
        <Button
          onPress={microphone.requestPermission}
          title="grant microphone permission"
        />
      </View>
    );
  }

  if (image !== null || video !== null) {
    return (
      <View style={styles.container}>
        {video !== null ? (
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
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={deletePicture}>
              <MaterialIcons name="delete" size={24} color="white" />
            </Pressable>
            <Pressable style={styles.button} onPress={submitPicture}>
              <MaterialIcons name="done" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device != null ? (
        <View style={styles.cameraRecording}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            audio={true}
            device={device}
            format={format}
            isActive={true}
            onError={(e) => console.log(e)}
            photo={true}
            resizeMode="contain"
            video={true}
            zoom={device.neutralZoom}
          />
        </View>
      ) : (
        <View />
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={24} color="white" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              pressed
                ? [styles.cameraButton, styles.cameraButtonPressed]
                : styles.cameraButton,
            ]}
            onPress={shortPress}
            onLongPress={startRecording}
            onPressOut={stopRecording}
          ></Pressable>
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
    backgroundColor: "black",
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
  cameraRecording: {
    flex: 1,
    borderColor: "#344e41",
    borderWidth: 5,
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
    paddingBottom: 30,
  },
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: "100%",
    borderWidth: 5,
    borderColor: "#344e41",
    backgroundColor: "#a3b18a",
  },
  cameraButtonPressed: {
    backgroundColor: "#344e41",
  },
  cameraSwitch: {
    flexDirection: "row",
    alignSelf: "center",
    width: 100,
    height: 50,
    backgroundColor: "#dad7cd",
    borderRadius: 25,
  },
  cameraSwitchItem: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  active: {
    backgroundColor: "#a3b18a",
    borderRadius: "100%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
