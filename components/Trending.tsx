import { Post } from "@/app/(tabs)/home";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { icons } from "@/constants";

interface TrendingProps {
  posts: Post[];
}

const zoomIn = {
  from: {
    scale: 0.9,
  },
  to: {
    scale: 1.1,
  },
};

const zoomOut = {
  from: {
    scale: 1,
  },
  to: {
    scale: 0.9,
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: string;
  item: Post;
}) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5 "
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10 overflow-hidden"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 my-5 rounded-[35px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute w-12 h-12 "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: TrendingProps) => {
  const [activeItem, setActiveItem] = useState(posts[1]?.$id);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
