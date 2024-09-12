import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

interface SearchProps {
  initalQuery?: string;
}
const SearchInput = ({ initalQuery }: SearchProps) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initalQuery || "");
  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholderTextColor={"#cdcde0"}
        placeholder="Search for video topic"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search"
            );
          }

          if (pathName.startsWith("/search")) {
            return router.setParams({ query });
          } else {
            return router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
