import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  useWindowDimensions,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { getSecureValue, logout } from "../util/loginInfo";
import { isLoggedInAtom } from "../App";
import { PrimitiveAtom, atom, useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { RUEmpty } from "../util/RUEmpty";
import JobBlockPJ from "../components/JobBlockPJ";
import { callAPI } from "../util/callAPIUtil";
import { jobItemT } from "../types/JobItemT";
import user from "../asset/user.png";
import { inUserT } from "../types/userT";
import { useIsFocused } from "@react-navigation/native";
import UserManage from "../components/UserManage";

export const pendingJob = atom<jobItemT | null>(null);
export const userInfo = atom<inUserT | null>(null);

function Home(): React.JSX.Element {
  useEffect(() => {
    const ff = async () => {
      const ws = new WebSocket("ws://10.0.2.2:8080/api/io");

      ws.onopen = async () => {
        // connection opened
        ws.send((await getSecureValue("jwtToken")).toString()); // send a message
      };

      ws.onmessage = (e) => {
        // a message was received
        Alert.alert("YO!", JSON.parse(e.data).msg, [{ text: "OK" }]);
        console.log("msg:", e);
      };

      ws.onerror = (e) => {
        // an error occurred
        console.log("err", e);
      };

      ws.onclose = (e) => {
        // connection closed
        console.log(e.code, e.reason);
      };
    };
    ff();
  }, []);
  const isFocused = useIsFocused();
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await callAPI("/api/user/me", "POST", {}, true);

        const me: inUserT = (await res.json()).res;

        setUserInfo(me);
        if (res.status == 451) {
          Alert.alert(
            "糟糕！",
            "您本次的登入資訊已無效\n可能是在其他地方登入了，或是個人資料已被修改\n如有需要，請洽管理人員！",
            [
              {
                text: "OK",
                onPress: async () => {
                  await logout();
                  setIsLoggedIn(false);
                },
              },
            ]
          );
        }
        if (me.Role == 300) {
          const currentJob = await (
            await callAPI("/api/claimed/current", "POST", {}, true)
          ).json();
          if (!RUEmpty(currentJob)) {
            setPendingJob({
              ID: currentJob.ID,
              FromLoc: currentJob.FromLoc,
              Mid: currentJob.Mid,
              ToLoc: currentJob.ToLoc,
            });
          } else {
            setPendingJob(null);
          }
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    getUserInfo();
  }, [isFocused]);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;
  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [getPendingJob, setPendingJob] = useAtom(pendingJob);

  if (getUserInfo == null) {
    return <></>;
  }

  return (
    <SafeAreaView className="h-full flex justify-center">
      <View className="px-5 flex flex-col justify-around h-4/5">
        <View className="flex flex-row justify-around items-center">
          <Text className="text-xl">歡迎！{getUserInfo!.Username}</Text>
          <Pressable
            onPress={() => {
              navigation.navigate("userInfoP");
            }}
          >
            <Icon source={user} size={ww * 0.15} />
          </Pressable>
        </View>
        <Pressable
          className="flex flex-row content-center bg-blue-300 rounded-lg px-9 py-2 justify-center "
          onPress={() => {
            getUserInfo.Role === 100
              ? navigation.navigate("jobsAdminP")
              : navigation.navigate("jobsP");
          }}
        >
          <View className="w-1/6">
            <Icon source="truck-fast" size={0.12 * ww} />
          </View>

          <View className="flex content-center justify-center">
            <Text className="text-3xl">工作去</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("turnOverP")}
        >
          <View className="w-1/6">
            <Icon source="chart-timeline-variant" size={0.12 * ww} />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl">營業額查詢</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("customerSP")}
        >
          <View className="w-1/6">
            <Icon source="phone-classic" size={0.12 * ww} />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl">24H客服</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("mainTainP")}
        >
          <View className="w-1/6">
            <Icon source="tools" size={0.12 * ww} />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl">維修保養</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("alertP")}
        >
          <View className="w-1/6">
            <Icon source="exclamation" size={0.12 * ww} />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl">公告欄</Text>
          </View>
        </Pressable>
        <JobBlockPJ jobItem={getPendingJob} />
        {getUserInfo.Role === 100 ? <UserManage /> : <></>}
        <Pressable
          onPress={async () => {
            await logout();
            setIsLoggedIn(false);
          }}
        >
          <Text>登出</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default Home;
