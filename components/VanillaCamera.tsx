import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function VanillaCamera() {
  const [image, setImage] = useState<string | null>(null);

  const [permissionStatus, requestPermission] =
    ImagePicker.useCameraPermissions();

  const getImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [9, 16],
      mediaTypes: ["videos", "images"],
      quality: 1,
      videoMaxDuration: 7,
    });

    if (result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  if (!permissionStatus?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Take a picture" onPress={getImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
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
});
