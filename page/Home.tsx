import React, { useCallback, useEffect, useState, useRef } from "react";
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
  StyleSheet,
  Platform,
} from "react-native";
import { Icon } from "react-native-paper";
import { getSecureValue } from "../util/loginInfo";
import { fnAtom, pendingJob, userInfo } from "../App";
import { useStore } from "jotai";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { RUEmpty } from "../util/RUEmpty";
import JobBlockPJ from "../components/JobBlockPJ";
import { callAPI, download } from "../util/callAPIUtil";
import user from "../asset/user.png";
import { cmpInfo, inUserT } from "../types/userT";
import { AlertMe } from "../util/AlertMe";
import { Dropdown } from "react-native-element-dropdown";

function usePersistentWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  // const wsUrl = Platform.OS === "ios"
  //   ? "wss://apikunhong.kunhong.org/api/io/"
  //   : "wss://apikunhong.kunhong.org/api/io";
  useEffect(() => {
    let socket: WebSocket | null = null;

    const initializeWebSocket = async () => {
      const wsUrl =
        Platform.OS === "ios"
          ? "ws://10.0.2.2:8080/api/io/"
          : "ws://10.0.2.2:8080/api/io";
      socket = new WebSocket(wsUrl);

      socket.onopen = async () => {
        console.log("WebSocket connected");
        try {
          const jwt = await getSecureValue("jwtToken");
          if (jwt) {
            socket?.send(jwt.toString());
          }
        } catch (err) {
          console.error("Failed to retrieve JWT", err);
        }
      };

      socket.onmessage = (e) => {
        try {
          const message = JSON.parse(e.data);
          Alert.alert("Notification", message.msg, [{ text: "OK" }]);
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
      };

      socket.onclose = (e) => {
        console.log(`WebSocket closed: ${e.code}, ${e.reason}`);
      };

      setWs(socket);
    };

    initializeWebSocket();

    return () => {
      if (socket) {
        socket.close();
        console.log("WebSocket cleaned up");
      }
    };
  }, [url]);

  return ws;
}

function Home(): React.JSX.Element {
  const store = useStore();
  const [isFocus, setIsFocus] = useState(false);
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);
  const [value, setValue] = useState(null);

  const navigation = useNavigation<ScreenProp>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();
  const ww = Dimensions.get("window").width;
  const cS = usc();
  const isF = useIsFocused();
  const ws = usePersistentWebSocket("ws://10.0.2.2:8080/api/io/");

  const setData = useCallback(async () => {
    console.log("rerun");

    setLoading(true);
    try {
      if (store.get(fnAtom).getUserInfofn() == null) {
        const res = await callAPI("/api/user/me", "POST", {}, true);
        if (!res.ok) throw res;

        const me: inUserT = await res.json();
        store.get(fnAtom).setUserInfofn(me);
      }

      if (store.get(fnAtom).getUserInfofn().Role === 300) {
        const res2 = await callAPI("/api/claimed/current", "POST", {}, true);
        if (!res2.ok) throw res2;

        const currentJob = await res2.json();
        store.get(fnAtom).setPJfn(RUEmpty(currentJob) ? null : currentJob);
      }
    } catch (error) {
      if (error instanceof Response) {
        if (error.status === 451 || error.status === 401) {
          store.get(fnAtom).codefn();
        } else {
          AlertMe(error);
        }
      }
      if (
        error instanceof TypeError &&
        error.message === "Network request failed"
      ) {
        Alert.alert("糟糕！", "請檢察網路有沒有開", [{ text: "OK" }]);
      }
    } finally {
      setLoading(false);
    }
  }, [store]);
  const getCmp = useCallback(async () => {
    const cmpList: cmpInfo[] = await (
      await callAPI("/api/cmp/all", "GET", {}, true)
    ).json();
    setCmpList(cmpList);
  }, []);
  useEffect(() => {
    setData();
    getCmp();
  }, [isF]);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          className="h-full flex justify-center items-center"
          size="small"
          color="#0000ff"
        />
      ) : (
        <SafeAreaView className="h-full flex justify-center">
          <View className="px-5 flex flex-col justify-around">
            <View className="flex flex-row justify-around items-center">
              <Text allowFontScaling={false}className="text-2xl dark:text-white">
                歡迎！{store.get(fnAtom).getUserInfofn()?.Username}
              </Text>
              <Pressable onPress={() => navigation.navigate("userInfoP")}>
                <Icon
                  color={cS === "light" ? "black" : "white"}
                  source={user}
                  size={ww * 0.15}
                />
              </Pressable>
            </View>

            <Pressable
              className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center "
              onPress={() => {
                store.get(fnAtom).getUserInfofn().Role === 300
                  ? navigation.navigate("jobsP")
                  : navigation.navigate("jobsAdminP");
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
                <Text allowFontScaling={false}className="text-3xl dark:text-white">工作去</Text>
              </View>
            </Pressable>
            <Pressable
              className="flex flex-row content-center  my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                <Text allowFontScaling={false}className="text-3xl dark:text-white">營業額查詢</Text>
              </View>
            </Pressable>
            {store.get(fnAtom).getUserInfofn().Role >= 300 && (
              <>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">24H客服</Text>
                  </View>
                </Pressable>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">維修保養</Text>
                  </View>
                </Pressable>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
                  onPress={() => navigation.navigate("gasP")}
                >
                  <View className="w-1/6">
                    <Icon
                      source="tools"
                      color={cS == "light" ? "black" : "white"}
                      size={0.12 * ww}
                    />
                  </View>
                  <View className="flex content-center justify-center">
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">加油</Text>
                  </View>
                </Pressable>
              </>
            )}

            <Pressable
              className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                <Text allowFontScaling={false}className="text-3xl dark:text-white">公告欄</Text>
              </View>
            </Pressable>
            {store.get(fnAtom).getUserInfofn().Role == 300 && (
              <JobBlockPJ setData={setData} />
            )}

            {store.get(fnAtom).getUserInfofn().Role <= 200 ? (
              <>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">用戶管理</Text>
                  </View>
                </Pressable>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">
                      已接取的任務
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">待核可維修</Text>
                  </View>
                </Pressable>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
                  onPress={() => navigation.navigate("adminGasP")}
                >
                  <View className="w-1/6">
                    <Icon
                      color={cS == "light" ? "black" : "white"}
                      source="tools"
                      size={0.12 * ww}
                    />
                  </View>
                  <View className="flex content-center justify-center">
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">待核可加油</Text>
                  </View>
                </Pressable>
                <Pressable
                  className="flex flex-row content-center my-2 bg-blue-300 dark:bg-slate-500 rounded-lg px-9 py-2 justify-center"
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
                    <Text allowFontScaling={false}className="text-3xl dark:text-white">下載報告</Text>
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
                <Text allowFontScaling={false}                  className="text-2xl dark:text-white"
                  style={{ verticalAlign: "middle", textAlign: "center" }}
                >
                  登出
                </Text>
              </Pressable>
              {/* <Text allowFontScaling={false}>{JSON.stringify(store.get(pendingJob))}</Text> */}
            </View>
            {/* </ScrollView> */}
          </View>
          {show && (
            <Dialog.Container
              contentStyle={{
                backgroundColor: cS === "light" ? "#ffffff" : "#3A3B3C",
              }}
              visible={show}
            >
              <View>
                <Dialog.Description
                allowFontScaling={false}
                  style={{
                    color: cS === "light" ? "black" : "#ffffff",
                    fontSize: 25,
                  }}
                >
                  請輸入年月
                </Dialog.Description>
                <Dialog.Input
                allowFontScaling={false}
                  style={{ color: cS === "light" ? "black" : "#ffffff" }}
                  placeholder="西元年"
                  onChangeText={(e: string) => setYear(e)}
                  keyboardType="numeric"
                />
                <Dialog.Input
                allowFontScaling={false}
                  placeholder="月份"
                  style={{ color: cS === "light" ? "black" : "#ffffff" }}
                  onChangeText={(e: string) => setMonth(e)}
                  keyboardType="numeric"
                />
                <Text allowFontScaling={false}>{value}</Text>
                {store.get(fnAtom).getUserInfofn().Role <= 100 ? (
                  <Dropdown
                  allowFontScaling={false}
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: "blue" },
                    ]}
                    mode="modal"
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={cmpList}
                    search
                    labelField="Name"
                    valueField="ID"
                    placeholder={!isFocus ? "所屬公司" : "..."}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setValue(item.ID);
                      setIsFocus(false);
                    }}
                  />
                ) : (
                  <View>
                    <Text  allowFontScaling={false}className=" dark:text-white text-2xl">
                      所屬公司：{getUserInfo?.Cmpname}
                    </Text>
                  </View>
                )}
                <Dialog.Button
                allowFontScaling={false}
                  label="送出"
                  onPress={async () => {
                    await download(year!, month!, value);
                    setShow(false);
                  }}
                />
                <Dialog.Button allowFontScaling={false} label="關閉" onPress={() => setShow(false)} />
              </View>
            </Dialog.Container>
          )}
        </SafeAreaView>
      )}
    </>
  );
}

export default Home;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
  container: {
    display: "flex",
    paddingHorizontal: 10,
  },
  dropdown: {
    backgroundColor: "rgb(233, 223, 235)",
    // height: 50,
    borderColor: "gray",
    // borderWidth: 0.5,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
