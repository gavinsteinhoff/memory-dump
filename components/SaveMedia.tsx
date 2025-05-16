import { saveToLibraryAsync, usePermissions } from "expo-media-library";
import { Button } from "react-native";

export default function SaveMedia(mediaUri: string) {
  const [permissionResponse, requestPermission] = usePermissions();

  async function saveMedia() {
    if (
      permissionResponse !== null &&
      permissionResponse.status !== "granted"
    ) {
      await requestPermission();
    }

    await saveToLibraryAsync(mediaUri);
  }

  return <Button onPress={saveMedia} title="Save" />;
}
