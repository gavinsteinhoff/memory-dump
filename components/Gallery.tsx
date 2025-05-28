import { Styles } from "@/utils/styles";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import AwesomeGallery, { RenderItemInfo } from "react-native-awesome-gallery"; // Assuming this is your full-screen gallery

const imageWidth = Math.ceil(Dimensions.get("screen").width / 3);
const imageHeight = (imageWidth / 9) * 16;

const renderItem = ({ item, setImageDimensions }: RenderItemInfo<string>) => {
  console.log(item);
  return (
    <Image
      source={item}
      style={{
        height: "100%",
        width: "100%",
      }}
      contentFit="contain"
      contentPosition="top"
      onLoad={(e) => {
        const { width, height } = e.source;
        setImageDimensions({ width, height });
      }}
    />
  );
};

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery(props: ImageGalleryProps) {
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [galleryIdex, setGalleryIndex] = useState<number>(0);

  useEffect(() => {
    const backAction = () => {
      if (galleryVisible) {
        setGalleryVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [galleryVisible]);

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
      {!galleryVisible ? (
        <View />
      ) : (
        <View style={styles.modalContainer}>
          <AwesomeGallery
            data={props.images}
            initialIndex={galleryIdex}
            onSwipeToClose={() => setGalleryVisible(false)}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: imageWidth,
    height: imageHeight,
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "red",
  },
});
