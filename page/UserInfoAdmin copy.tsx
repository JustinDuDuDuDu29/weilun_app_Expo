import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPic from "../components/DriverPic";
import { Icon } from "react-native-paper";
import { cmpInfo, inUserT } from "../types/userT";
import UserCU from "../components/UserCU";

function UserInfoAdmin({
  route,
}: {
  route: RouteProp<{ params: { uid: number } }, "params">;
}): React.JSX.Element {
  const [editable, setEditable] = useState(false);
  const [OInfo, setOInfo] = useState<inUserT>();

  const getData = useCallback(async () => {
    try {
      const res = await callAPI(
        `/api/user/${route.params.uid}`,
        "GET",
        {},
        true
      );
      const data = await res.json();

      setOInfo(data);
      data;
    } catch (error) {
      console.log("error: ", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <ScrollView className="mx-4 my-3">
        {OInfo && (
          <UserCU
            editable={editable}
            OInfo={OInfo!}
            setEditable={setEditable}
          />
        )}
        <View className="flex flex-col items-center">
          {OInfo?.Role === 300 && !OInfo.ApprovedDate?.Valid && (
            <Pressable
              className="bg-green-300 rounded-xl py-1 w-1/2 my-2"
              onPress={() => {
                // navigation.navigate("changePasswordP");
                Alert.alert("注意！", "即將核可此用戶資料", [
                  {
                    text: "確定",
                    onPress: async () => {
                      const res = await callAPI(
                        `/api/user/approve/${OInfo?.ID}`,
                        "POST",
                        { id: OInfo?.ID, pwd: OInfo?.Phonenum, oldPwd: "" },
                        true
                      );
                      if (res.status == 200) {
                        Alert.alert("成功!", "已核可此用戶");
                        navigation.goBack();
                      }
                    },
                  },
                  { text: "取消" },
                ]);
              }}
            >
              <Text allowFontScaling={false}                style={{ textAlign: "center", textAlignVertical: "center" }}
                className="text-2xl"
              >
                核可
              </Text>
            </Pressable>
          )}
          <Pressable
            className="bg-red-300 rounded-xl py-1 w-1/2 my-2"
            onPress={() => {
              // navigation.navigate("changePasswordP");
              Alert.alert("注意！", "此用戶的密碼將重置成手機號碼", [
                {
                  text: "確定",
                  onPress: async () => {
                    const res = await callAPI(
                      "/api/user/pwdreset",
                      "POST",
                      { id: OInfo?.ID },
                      true
                    );
                    if (res.status == 200) {
                      Alert.alert(
                        "成功!",
                        "請通知該使用者，不然他真的會哭出來"
                      );
                    }
                  },
                },
                { text: "取消" },
              ]);
            }}
          >
            <Text allowFontScaling={false}              style={{ textAlign: "center", textAlignVertical: "center" }}
              className="text-2xl"
            >
              重置密碼
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default UserInfoAdmin;
