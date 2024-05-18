import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { atom, useAtom } from "jotai";
import { userInfo } from "./Home";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPic from "../components/DriverPic";

function UserInfo(): React.JSX.Element {
  useEffect(() => {
    // const getData = async () => {
    //   try {
    //   } catch (error) {
    //     console.log("error: ", error);
    //   }
    // };
    // getData();
  }, []);
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
          <Text className="text-xl">姓名：{getUserInfo?.Username}</Text>
          <Text className="text-xl">電話：{getUserInfo?.Phonenum}</Text>
          <Text className="text-xl">編號：{getUserInfo?.ID}</Text>
          <Text className="text-xl">所屬公司：{getUserInfo?.Cmpname}</Text>
          <Text className="text-xl">類別：{roleName}</Text>
        </View>
        <Button
          onPress={() => {
            navigation.navigate("changePasswordP");
          }}
        >
          <Text>修改密碼</Text>
        </Button>
        {getUserInfo?.Role == 300 ? <DriverPic /> : <></>}
      </ScrollView>
    </SafeAreaView>
  );
}
export default UserInfo;
