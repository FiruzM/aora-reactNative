import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getUserId, signOut } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import { StatusBar } from "expo-status-bar";
import { Post } from "./home";

import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

interface User {
  avatar: string;
  $id: string;
  username: string;
}
const Profile = () => {
  const context = useGlobalContext() as {
    user: User;
    setUser: any;
    setIsLoggedIn: any;
  };

  const { data: posts } = useAppwrite(() => getUserId(context?.user!.$id)) as {
    data: { documents: Post[] };
  };

  const logOut = async () => {
    await signOut();

    context.setUser(null);

    context.setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts.documents}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-ful justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="self-end" onPress={logOut}>
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 overflow-hidden border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: context?.user?.avatar }}
                resizeMode="cover"
                className="w-full h-full"
              />
            </View>

            <InfoBox
              title={context.user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.documents.length || 0}
                subTitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />

              <InfoBox
                title="1.2k"
                subTitle="Followers"
                titleStyles="text-xl"
              />
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

export default Profile;
