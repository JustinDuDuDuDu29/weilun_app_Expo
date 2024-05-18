import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { atom, useAtom } from "jotai";
import { userInfo } from "./Home";
import { Button } from "react-native-paper";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPic from "../components/DriverPic";
import { inUserT } from "../types/userT";

function UserInfoAdmin({
  route,
}: {
  route: RouteProp<{ params: { uid: number } }, "params">;
}): React.JSX.Element {
  const [user, setUser] = useState<inUserT>();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await callAPI(
          `/api/user/${route.params.uid}`,
          "GET",
          {},
          true
        );
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    getData();
  }, []);

  const roleName =
    user?.Role == 100 ? "管理員" : user?.Role == 200 ? "公司負責人" : "司機";

  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <ScrollView className="mx-4 my-3">
        <View>
          <Text className="text-xl">姓名：{user?.Username}</Text>
          <Text className="text-xl">電話：{user?.Phonenum}</Text>
          <Text className="text-xl">編號：{user?.ID}</Text>
          <Text className="text-xl">所屬公司：{user?.Cmpname}</Text>
          <Text className="text-xl">類別：{roleName}</Text>
        </View>
        <Button
          onPress={() => {
            navigation.navigate("changePasswordP");
          }}
        >
          <Text>修改密碼</Text>
        </Button>
        {user?.Role == 300 ? <DriverPic /> : <></>}
      </ScrollView>
    </SafeAreaView>
  );
}
export default UserInfoAdmin;
