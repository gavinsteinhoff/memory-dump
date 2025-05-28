import EventDetails from "@/components/EventDetails";
import { useLocalSearchParams } from "expo-router";

export default function Events() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EventDetails eventId={id} />;
}
