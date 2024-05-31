import React, { useEffect } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { atom, useAtom } from "jotai";
import { userInfo } from "./Home";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPic from "../components/DriverPic";

function UserInfo(): React.JSX.Element {
  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  const roleName =
    getUserInfo?.Role == 100
      ? "管理員"
      : getUserInfo?.Role == 200
      ? "公司負責人"
      : "司機";

  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <ScrollView className="mx-4 my-3">
        <View>
          <Text className="text-xl dark:text-white my-2">
            姓名：{getUserInfo?.Username}
          </Text>
          <Text className="text-xl dark:text-white my-2">
            電話：{getUserInfo?.Phonenum}
          </Text>
          <Text className="text-xl dark:text-white my-2">
            編號：{getUserInfo?.ID}
          </Text>
          <Text className="text-xl dark:text-white my-2">
            所屬公司：{getUserInfo?.Cmpname}
          </Text>
          <Text className="text-xl dark:text-white my-2">類別：{roleName}</Text>
        </View>
        <Pressable
          className=" border border-purple-400 bg-purple-300 rounded-xl py-1"
          onPress={() => {
            navigation.navigate("changePasswordP");
          }}
        >
          <Text
            className="text-xl text-stone-800"
            style={{ verticalAlign: "middle", textAlign: "center" }}
          >
            修改密碼
          </Text>
        </Pressable>
        {getUserInfo?.Role == 300 ? (
          <View className="my-4">
            <DriverPic showOption={true} />
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
export default UserInfo;
