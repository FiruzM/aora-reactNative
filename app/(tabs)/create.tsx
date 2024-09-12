import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const context = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType: string) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/jpg", "image/jpeg", "image/png"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.video || !form.thumbnail || !form.title) {
      return Alert.alert("Error", "Please fill all the fields");
    }

    setLoading(true);

    try {
      await createVideo({ ...form, userId: context?.user?.$id });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (err: Error | any) {
      Alert.alert("Error", err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          keyboardType="Give your a catch title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                resizeMode={ResizeMode.CONTAIN}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="contain"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />

                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a File
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          keyboardType="The Prompt you use to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({});
