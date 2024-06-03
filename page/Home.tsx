import React, { useCallback, useEffect, useState } from "react";
// import { colorScheme, remapProps, useColorScheme } from "nativewind";
import Dialog from "react-native-dialog";
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
import { getSecureValue } from "../util/loginInfo";
import { fnAtom, isLoggedInAtom, pendingJob, userInfo } from "../App";
import { atom, useAtom, useStore } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { RUEmpty } from "../util/RUEmpty";
import JobBlockPJ from "../components/JobBlockPJ";
import { callAPI, download } from "../util/callAPIUtil";
import user from "../asset/user.png";
import { inUserT } from "../types/userT";
import { useIsFocused } from "@react-navigation/native";
import { AlertMe } from "../util/AlertMe";

// export const pendingJob = atom<currentJob | null>(null);
// export const userInfo = atom<inUserT | null>(null);

function Home(): React.JSX.Element {
  const store = useStore();

  const [show, setShow] = useState(false);
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;
  // const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  // const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const cS = usc();

  useEffect(() => {
    const ff = async () => {
      const ws = new WebSocket("wss://apiweilun.imdu29.com/api/io");

      ws.onopen = async () => {
        // connection opened

        setInterval(() => {
          ws.send("ping");
        }, 10000);
        const jwt = (await getSecureValue("jwtToken")).toString();
        ws.send(jwt); // send a message
      };

      ws.onmessage = (e) => {
        // a message was received
        Alert.alert("YO!", JSON.parse(e.data).msg, [{ text: "OK" }]);
      };

      ws.onerror = (e) => {
        // an error occurred
        console.log("err!", e);
      };

      ws.onclose = (e) => {
        // connection closed
        console.log("Closing");

        console.log(e.code, e.reason);
      };
    };
    ff();
  }, []);
  const isFocused = useIsFocused();

  const setData = useCallback(async () => {
    try {
      if (!getUserInfo) {
        const res = await callAPI("/api/user/me", "POST", {}, true);
        if (!res.ok) {
          throw res;
        }
        const me: inUserT = await res.json();
        setUserInfo(me);

        if (me.Role == 300) {
          const res2 = await callAPI("/api/claimed/current", "POST", {}, true);
          if (!res.ok) {
            throw res;
          }
          const currentJob = await res2.json();
          if (!RUEmpty(currentJob)) {
            store.get(fnAtom).setPJfn(currentJob);
          } else {
            store.get(fnAtom).setPJfn(null);
          }
        }
      }
    } catch (error) {
      if (error instanceof Response) {
        switch (error.status) {
          case 451:
            store.get(fnAtom).codefn();
            break;

          default:
            AlertMe(error);
            break;
        }
      }
      if (error instanceof TypeError) {
        if (error.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      }
    }
  }, []);

  useEffect(() => {
    // console.log("it is ", store.get(fnAtom).getPJfn());
    setData();
  }, [isFocused]);

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
        {getUserInfo.Role != 100 && (
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
        )}
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
        <JobBlockPJ jobItem={store.get(fnAtom).getPJfn()} />
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
                <Icon
                  color={cS == "light" ? "black" : "white"}
                  source="vector-polygon"
                  size={0.12 * ww}
                />
              </View>
              <View className="flex content-center justify-center">
                <Text className="text-3xl dark:text-white">已接取的任務</Text>
              </View>
            </Pressable>
            <Pressable
              className="flex flex-row content-center bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
              onPress={() => setShow(true)}
            >
              <View className="w-1/6">
                <Icon
                  color={cS == "light" ? "black" : "white"}
                  source="file-download-outline"
                  size={0.12 * ww}
                />
              </View>
              <View className="flex content-center justify-center">
                <Text className="text-3xl dark:text-white">下載報告</Text>
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
              console.log("BYE");
              store.get(fnAtom).logoutfn();
            }}
          >
            <Text
              className="text-xl dark:text-white"
              style={{ verticalAlign: "middle", textAlign: "center" }}
            >
              登出
            </Text>
          </Pressable>
        </View>
      </View>
      {show && (
        <Dialog.Container visible={show}>
          <Dialog.Description style={{ color: "black", fontSize: 25 }}>
            請輸入年月
          </Dialog.Description>
          <Dialog.Input
            style={{ color: "black" }}
            placeholder="西元年"
            onChangeText={(e: string) => {
              setYear(e);
            }}
            keyboardType="numeric"
          ></Dialog.Input>
          <Dialog.Input
            placeholder="月份"
            style={{ color: "black" }}
            onChangeText={(e: string) => {
              setMonth(e);
            }}
            keyboardType="numeric"
          ></Dialog.Input>
          <Dialog.Button
            label="送出"
            onPress={async () => {
              // const res = await callAPI(
              //   `/api/revenue/excel?year=${year}&month=${month}`,
              //   "GET",
              //   {},
              //   true
              // );

              const res = await download(year!, month!);
              // download(year!, month!);
              setShow(false);
            }}
          />
          <Dialog.Button
            label="關閉"
            onPress={async () => {
              setShow(false);
            }}
          />
        </Dialog.Container>
      )}
    </SafeAreaView>
  );
}

export default Home;
