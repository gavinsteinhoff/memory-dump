import VanillaCamera from "@/components/VanillaCamera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [eventId, setEventId] = useState<string | null>("1");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <VanillaCamera />
      {/* <RNVCamera eventId={eventId ?? ""} /> */}
    </SafeAreaView>
  );
}
