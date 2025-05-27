import RNVCamera from "@/components/RNVCamera";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RNVCamera />
    </SafeAreaView>
  );
}
