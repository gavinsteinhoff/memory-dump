import { UseMedia } from "@/utils/azure-storage";
import { Styles } from "@/utils/styles";
import { Text, View } from "react-native";
import ImageGallery from "./Gallery";

type Props = { eventId: string };

export default function EventDetails(props: Props) {
  const { isLoading, images } = UseMedia(props.eventId);

  if (isLoading) {
    return (
      <View style={Styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  if (!isLoading) {
    return (
      <View style={Styles.container}>
        <ImageGallery images={images} />
      </View>
    );
  }
}
