import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { searchtPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import { StatusBar } from "expo-status-bar";
import { Post } from "../(tabs)/home";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchtPosts(query)) as {
    data: { documents: Post[] };
    refetch: () => void;
  };
  console.log(query);
  console.log(posts);

  useEffect(() => {
    refetch();
  }, [query]);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts.documents}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>

            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initalQuery={query.toString()} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Try searching something else"
          />
        )}
      />
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({});
