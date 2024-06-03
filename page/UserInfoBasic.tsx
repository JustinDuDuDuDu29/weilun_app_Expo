import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from "react-native";
import UserCU from "../components/UserCU";
import { callAPI } from "../util/callAPIUtil";
import { inUserT } from "../types/userT";
import { enableFreeze } from "react-native-screens";
import { useIsFocused } from "@react-navigation/native";
import { AlertMe } from "../util/AlertMe";
import { fnAtom } from "../App";
import { useStore } from "jotai";

function UserInfoBasic({
  // uid,
  OInfo,
}: {
  // uid: number;
  OInfo: inUserT;
}): React.JSX.Element {
  const [editable, setEditable] = useState(false);

  const store = useStore();
  const approveUser = async () => {
    try {
      const res = await callAPI(
        `/api/user/approve/${OInfo?.ID}`,
        "POST",
        { id: OInfo?.ID, pwd: OInfo?.Phonenum, oldPwd: "" },
        true
      );
      if (!res.ok) {
        throw res;
      }
      Alert.alert("成功!", "已核可此用戶");
    } catch (err) {
      if (err instanceof Response) {
        switch (err.status) {
          case 451:
            store.get(fnAtom).codefn();
            break;

          default:
            AlertMe(err);
            break;
        }
      }
      if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  };

  const deleteUser = async () => {
    try {
      const res = await callAPI(
        "/api/user/",
        "DELETE",
        { id: OInfo?.ID },
        true
      );
      if (!res.ok) {
        throw res;
      }
      Alert.alert("成功!", "已刪除此用戶");
    } catch (err) {
      if (err instanceof Response) {
        switch (err.status) {
          case 451:
            store.get(fnAtom).codefn();
            break;

          default:
            AlertMe(err);
            break;
        }
      }
      if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  };

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
                      await approveUser();
                    },
                  },
                  { text: "取消" },
                ]);
              }}
            >
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
                className="text-xl"
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
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className="text-xl"
            >
              重置密碼
            </Text>
          </Pressable>
          <Pressable
            className="bg-red-300 rounded-xl py-1 w-1/2 my-2"
            onPress={() => {
              // navigation.navigate("changePasswordP");
              Alert.alert("注意！", "即將刪除此用戶", [
                {
                  text: "確定",
                  onPress: async () => {
                    await deleteUser();
                  },
                },
                { text: "取消" },
              ]);
            }}
          >
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className="text-xl"
            >
              刪除用戶
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserInfoBasic;
