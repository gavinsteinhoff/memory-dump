import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{ flex: 1, alignItems: "flex-start", backgroundColor: "black" }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "white" },
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
