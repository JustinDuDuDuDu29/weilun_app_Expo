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
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-paper";
import { getSecureValue } from "../util/loginInfo";
import { fnAtom, pendingJob, userInfo } from "../App";
import { useStore } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { RUEmpty } from "../util/RUEmpty";
import JobBlockPJ from "../components/JobBlockPJ";
import { callAPI, download } from "../util/callAPIUtil";
import user from "../asset/user.png";
import { inUserT } from "../types/userT";
import { useIsFocused } from "@react-navigation/native";
import { AlertMe } from "../util/AlertMe";
import { SplashScreen } from "../components/Aplash";

function Home(): React.JSX.Element {
  const store = useStore();
  const isFocus = useIsFocused();

  // const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();
  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;

  const cS = usc();

  useEffect(() => {
    const ff = async () => {
      const ws = new WebSocket("wss://apiweilun.imdu29.com/api/io");
      // console.log("ff...");

      // const ws = new WebSocket("ws://10.0.2.2:8080/api/io");

      ws.onopen = async () => {
        // console.log("SS");
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
        console.log("err!", ws.url);
      };

      ws.onclose = (e) => {
        // connection closed
        console.log("Closing");

        console.log(e.code, e.reason);
      };
    };
    ff();
  }, [isFocus]);

  const setData = useCallback(async () => {
    setLoading(true);
    try {
      // if (!store.get(fnAtom).getUserInfofn()) {
      // if (!store.get(userInfo)) {
      console.log("IN");
      const res = await callAPI("/api/user/me", "POST", {}, true);
      if (!res.ok) {
        throw res;
      }
      const me: inUserT = await res.json();
      store.get(fnAtom).setUserInfofn(me);

      if (me.Role == 300) {
        const res2 = await callAPI("/api/claimed/current", "POST", {}, true);
        if (!res2.ok) {
          throw res;
        }
        const currentJob = await res2.json();
        if (!RUEmpty(currentJob)) {
          console.log("SS");
          store.get(fnAtom).setPJfn(currentJob);
          // store.set(pendingJob, currentJob);
        } else {
          store.get(fnAtom).setPJfn(null);
        }
        // }
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setData();
  }, [isFocus]);

  // if (!store.get(userInfo) || loading) {
    // if (loading) {
    return(<> { (!store.get(userInfo))?
    <Text>{JSON.stringify(store.get(pendingJob))}</Text>
   // return <ActivityIndicator size="small" color="#0000ff
:

    <SafeAreaView className="h-full flex justify-center">
      <View className="px-5 flex flex-col justify-around h-4/5">
        <View className="flex flex-row justify-around items-center">
          <Text className="text-xl dark:text-white">
            歡迎！{store.get(fnAtom).getUserInfofn().Username}
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
            store.get(fnAtom).getUserInfofn().Role === 100
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
        {store.get(fnAtom).getUserInfofn().Role != 100 && (
          <>
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
          </>
        )}

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
        <JobBlockPJ setData={setData} />

        {store.get(fnAtom).getUserInfofn().Role === 100 ? (
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
              onPress={() => navigation.navigate("adminMainTainP")}
            >
              <View className="w-1/6">
                <Icon
                  color={cS == "light" ? "black" : "white"}
                  source="tools"
                  size={0.12 * ww}
                />
              </View>
              <View className="flex content-center justify-center">
                <Text className="text-3xl dark:text-white">待核可維修</Text>
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
              await store.get(fnAtom).logoutfn();
            }}
          >
            <Text
              className="text-xl dark:text-white"
              style={{ verticalAlign: "middle", textAlign: "center" }}
            >
              登出
            </Text>
          </Pressable>
          {/* <Text>{JSON.stringify(store.get(pendingJob))}</Text> */}
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
    }</>)
}
//

export default Home;
