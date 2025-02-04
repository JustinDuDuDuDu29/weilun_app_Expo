import React, { useEffect } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { atom, useAtom, useStore } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPic from "../components/DriverPic";
import { fnAtom, userInfo } from "../App";

function UserInfo(): React.JSX.Element {
  const store = useStore();
  // const [store.get(fnAtom).getUserInfofn() setUserInfo] = useAtom();

  const roleName =
    store.get(fnAtom).getUserInfofn().Role == 100
      ? "管理員"
      : store.get(fnAtom).getUserInfofn().Role == 200
      ? "公司負責人"
      : "司機";

  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <ScrollView className="mx-4 my-3">
        {/* <Text allowFontScaling={false}>{JSON.stringify(store.get(fnAtom).getUserInfofn())}</Text> */}
        <View>
          <Text allowFontScaling={false}className="text-2xl dark:text-white my-2">
            姓名：{store.get(fnAtom).getUserInfofn().Username}
          </Text>
          <Text allowFontScaling={false}className="text-2xl dark:text-white my-2">
            電話：{store.get(fnAtom).getUserInfofn().Phonenum}
          </Text>
          <Text allowFontScaling={false}className="text-2xl dark:text-white my-2">
            編號：{store.get(fnAtom).getUserInfofn().ID}
          </Text>
          <Text allowFontScaling={false}className="text-2xl dark:text-white my-2">
            所屬公司：{store.get(fnAtom).getUserInfofn().Cmpname}
          </Text>
          <Text allowFontScaling={false}className="text-2xl dark:text-white my-2">類別：{roleName}</Text>
        </View>
        <Pressable
          className=" border border-purple-400 bg-purple-300 rounded-xl py-1"
          onPress={() => {
            navigation.navigate("changePasswordP");
          }}
        >
          <Text allowFontScaling={false}            className="text-2xl text-stone-800"
            style={{ verticalAlign: "middle", textAlign: "center" }}
          >
            修改密碼
          </Text>
        </Pressable>
        {store.get(fnAtom).getUserInfofn().Role == 300 ? (
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
