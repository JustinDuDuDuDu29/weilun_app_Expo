import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, Pressable, SafeAreaView, View, Text } from "react-native";
import { Icon } from "react-native-paper";
import { ScreenProp } from "../types/navigationT";

function UserManage(): React.JSX.Element {
  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;

  return (
    <SafeAreaView>
      <Pressable
        className="flex flex-row content-center bg-blue-300 rounded-lg px-9 py-2 justify-center"
        onPress={() => navigation.navigate("userManageP")}
      >
        <View className="w-1/6">
          <Icon source="head-outline" size={0.12 * ww} />
        </View>
        <View className="flex content-center justify-center">
          <Text className="text-3xl">用戶管理</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default UserManage;
