import { StyleSheet, Text, View } from "react-native";

type Props = { eventId: string };

export default function EventDetails(props: Props) {
  return (
    <View>
      <Text style={styles.text}>{props.eventId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
});
