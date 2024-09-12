import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

interface VideoCardProps {
  video: {
    title: string;
    thumbnail: string;
    video: string;
    creator: {
      username: string;
      avatar: string;
    };
  };
}

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}: VideoCardProps) => {
  const [play, setPlay] = useState(false);
  return (
    <View className="items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="w-full h-full rounded-lg"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-lg mt-3 bg-white/10 overflow-hidden"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) =>
            status.didJustFinish && setPlay(false)
          }
          onError={(error) => console.log("Video error:", error)}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl overflow-hidden mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute w-12 h-12 "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
