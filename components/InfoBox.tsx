import { View, Text } from "react-native";
import React from "react";

interface InfoBoxProps {
  title: string | number;
  subTitle?: string;
  containerStyles?: string;
  titleStyles: string;
}

const InfoBox = ({
  title,
  subTitle,
  containerStyles,
  titleStyles,
}: InfoBoxProps) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-center font-pregular text-gray-100 text-sm">
        {subTitle}
      </Text>
    </View>
  );
};

export default InfoBox;
