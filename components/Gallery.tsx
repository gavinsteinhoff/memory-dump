import { Styles } from "@/utils/styles";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import AwesomeGallery from "react-native-awesome-gallery"; // Assuming this is your full-screen gallery

const imageWidth = Math.ceil(Dimensions.get("screen").width / 3);
const imageHeight = (imageWidth / 9) * 16;
console.log(imageWidth);
console.log(imageHeight);

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery(props: ImageGalleryProps) {
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [galleryIdex, setGalleryIndex] = useState<number>(0);

  return (
    <View style={Styles.container}>
      <FlashList
        data={props.images}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.gridItem}
            onPress={() => {
              setGalleryIndex(index);
              setGalleryVisible(true);
            }}
          >
            <Image style={styles.image} source={item} contentFit="contain" />
          </Pressable>
        )}
        numColumns={3}
      />

      <Modal
        visible={galleryVisible}
        onRequestClose={() => setGalleryVisible(false)}
      >
        <AwesomeGallery
          data={props.images}
          initialIndex={galleryIdex}
          onSwipeToClose={() => setGalleryVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: "red",
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
});
