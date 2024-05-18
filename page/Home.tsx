import React, { useEffect, useState } from "react";
// import { colorScheme, remapProps, useColorScheme } from "nativewind";
import {
  SafeAreaView,
  View,
  Dimensions,
  Pressable,
  Alert,
  Text,
  useColorScheme as usc,
} from "react-native";
import { Icon } from "react-native-paper";
import { getSecureValue, logout } from "../util/loginInfo";
import { isLoggedInAtom } from "../App";
import { atom, useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { RUEmpty } from "../util/RUEmpty";
import JobBlockPJ from "../components/JobBlockPJ";
import { callAPI } from "../util/callAPIUtil";
import { currentJob } from "../types/JobItemT";
import user from "../asset/user.png";
import { inUserT } from "../types/userT";
import { useIsFocused } from "@react-navigation/native";

export const pendingJob = atom<currentJob | null>(null);
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
    const getData = async () => {
      try {
        if (!getUserInfo) {
          const res = await callAPI("/api/user/me", "POST", {}, true);

          const me: inUserT = await res.json();

          setUserInfo(me);
          console.log("me = ", me);
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
        }

        if (getUserInfo?.Role == 300) {
          const currentJob = await (
            await callAPI("/api/claimed/current", "POST", {}, true)
          ).json();
          if (!RUEmpty(currentJob)) {
            setPendingJob(currentJob);
          } else {
            setPendingJob(null);
          }
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    getData();
  }, [isFocused]);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;
  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const cS = usc();

  if (getUserInfo == null) {
    return <></>;
  }

  return (
    <SafeAreaView className="h-full flex justify-center">
      <View className="px-5 flex flex-col justify-around h-4/5">
        <View className="flex flex-row justify-around items-center">
          <Text className="text-xl dark:text-white">
            歡迎！{getUserInfo!.Username}
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate("userInfoP");
            }}
          >
            <Icon
              color={cS == "light" ? "black" : "white"}
              source={user}
              size={ww * 0.15}
            />
          </Pressable>
        </View>
        <Pressable
          className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center "
          onPress={() => {
            getUserInfo.Role === 100
              ? navigation.navigate("jobsAdminP")
              : navigation.navigate("jobsP");
          }}
        >
          <View className="w-1/6">
            <Icon
              source="truck-fast"
              color={cS == "light" ? "black" : "white"}
              size={0.12 * ww}
            />
          </View>

          <View className="flex content-center justify-center">
            <Text className="text-3xl dark:text-white">工作去</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center  bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("turnOverP")}
        >
          <View className="w-1/6">
            <Icon
              source="chart-timeline-variant"
              color={cS == "light" ? "black" : "white"}
              size={0.12 * ww}
            />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl dark:text-white">營業額查詢</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("customerSP")}
        >
          <View className="w-1/6">
            <Icon
              source="phone-classic"
              color={cS == "light" ? "black" : "white"}
              size={0.12 * ww}
            />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl dark:text-white">24H客服</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("mainTainP")}
        >
          <View className="w-1/6">
            <Icon
              source="tools"
              color={cS == "light" ? "black" : "white"}
              size={0.12 * ww}
            />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl dark:text-white">維修保養</Text>
          </View>
        </Pressable>
        <Pressable
          className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
          onPress={() => navigation.navigate("alertP")}
        >
          <View className="w-1/6">
            <Icon
              source="exclamation"
              color={cS == "light" ? "black" : "white"}
              size={0.12 * ww}
            />
          </View>
          <View className="flex content-center justify-center">
            <Text className="text-3xl dark:text-white">公告欄</Text>
          </View>
        </Pressable>
        <JobBlockPJ jobItem={getPendingJob} />
        {getUserInfo.Role === 100 ? (
          <>
            <Pressable
              className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
              onPress={() => navigation.navigate("userManageP")}
            >
              <View className="w-1/6">
                <Icon
                  source="head-outline"
                  color={cS == "light" ? "black" : "white"}
                  size={0.12 * ww}
                />
              </View>
              <View className="flex content-center justify-center">
                <Text className="text-3xl dark:text-white">用戶管理</Text>
              </View>
            </Pressable>
            <Pressable
              className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
              onPress={() => navigation.navigate("adminClaimedJobP")}
            >
              <View className="w-1/6">
                <Icon source="head-outline" size={0.12 * ww} />
              </View>
              <View className="flex content-center justify-center">
                <Text className="text-3xl dark:text-white">已接取的任務</Text>
              </View>
            </Pressable>
          </>
        ) : (
          <></>
        )}
        <View className="flex flex-row justify-between">
          <Pressable
            className=" dark:bg-rose-500 bg-green-200 w-1/4 rounded-xl py-2"
            onPress={async () => {
              await logout();
              setIsLoggedIn(false);
            }}
          >
            <Text
              className="text-xl dark:text-white"
              style={{ verticalAlign: "middle", textAlign: "center" }}
            >
              登出
            </Text>
          </Pressable>
          {/* <Pressable
            className="bg-red-200 w-1/4 rounded-xl py-2"
            onPress={() => {
              // if (colorScheme.get() == "dark") {
              //   setMode("light");
              // }
              // if (colorScheme.get() == "light") {
              //   setMode("dark");
              // }
            }}
          >
            <Text
              className="text-xl dark:text-white"
              style={{ verticalAlign: "middle", textAlign: "center" }}
            >
              {colorScheme.get()}
            </Text>
          </Pressable> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
