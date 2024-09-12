import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createUser } from "@/lib/appwrite";

const SignUp = () => {
  const [form, setform] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [isSubmiting, setIsSubmiting] = useState(false);
  const context = useGlobalContext();

  const submit = async () => {
    if (!form.userName || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
    }

    setIsSubmiting(true);

    try {
      const result = await createUser(form.email, form.password, form.userName);
      context?.setUser(result);
      context?.setIsLoggedIn(true);

      router.replace("/home");
    } catch (err: Error | any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px]"
          />

          <Text className="text-2xl text-white mt-10 font-psemibold">
            Sign Up
          </Text>

          <FormField
            title="Username"
            value={form.userName}
            handleChangeText={(e: any) => setform({ ...form, userName: e })}
            otherStyles="mt-7"
            keyboardType="Your unique username"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setform({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setform({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmiting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular ">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
