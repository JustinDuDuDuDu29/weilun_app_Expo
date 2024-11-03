import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Text,
  useColorScheme as usc,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { callAPI } from "../util/callAPIUtil";
import { revT } from "../types/revenueT";
import { LineChart } from "react-native-gifted-charts";
import CJBlock from "../components/CJBlock";
import { useAtom, useStore } from "jotai";
import { ClaimedJob } from "../types/JobItemT";
// import { SplashScreen } from "../components/Aplash";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function TurnOver(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const ww = Dimensions.get("window").width;
  const hh = Dimensions.get("window").height;
  const [data, setData] = useState<revT[]>();
  const [gDate, setGData] = useState<[]>();
  const [max, setMax] = useState<number>(-100);
  const [cj, setCJ] = useState<ClaimedJob[]>();
  const [year, SetYear] = useState<number>(new Date().getFullYear());
  const [month, SetMonth] = useState<number>(new Date().getMonth());

  const cS = usc();
  const store = useStore();
  const isFocus = useIsFocused();
  const getData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callAPI(
        `/api/revenue?${
          store.get(fnAtom).getUserInfofn()?.Role === 300
            ? "id=" + store.get(fnAtom).getUserInfofn()?.ID
            : "cmp=" + store.get(fnAtom).getUserInfofn()?.Belongcmp
        }`,
        "GET",
        {},
        true
      );
      const data = await res.json();
      if (!res.ok) {
        throw res;
      }
      setData(data);
      let tempMax = -100;
      const aa = data?.map((d: revT, i: number) => {
        if (d.Earn > tempMax) {
          tempMax = d.Earn;
        }
        return {
          value: d.Earn,
          dataPointText: d.Earn.toString(),
          label: `${new Date().getFullYear()}/${new Date().getMonth() - 1 + i}`,
        };
      });
      setMax(tempMax * 1.3);
      setGData(aa);
      console.log(aa);
      const ll = await callAPI(
        `/api/claimed/list?${
          store.get(fnAtom).getUserInfofn()?.Role === 300
            ? "id=" + store.get(fnAtom).getUserInfofn()?.ID
            : "cmp=" + store.get(fnAtom).getUserInfofn()?.Belongcmp
        }`,
        "GET",
        {},
        true
      );
      if (!ll.ok) throw ll;
      const cj = await ll.json();
      setCJ(cj);
      setIsLoading(false);
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
      } else if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  }, []);

  const getCompanyList = async () => {
    try {
      setIsLoading(true);
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
      } else if (err instanceof TypeError) {
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

  useEffect(() => {
    // getData();
  }, [isFocus]);
  const navigation = useNavigation();
  if (isLoading || max == -10) {
    <ActivityIndicator size="large" />;
  }
  return (
    <SafeAreaView className="px-3 my-2">
      <ScrollView className="px-3">
        <View>
          <Pressable
            onPress={async () => {
              if (month - 1 == 0) {
                SetMonth(12);
                SetYear(year - 1);
              } else {
                SetMonth(month - 1);
              }
              await getCompanyList();
            }}
          >
            <Text>上個月</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              if (month + 1 == 13) {
                SetMonth(1);
                SetYear(year + 1);
              } else {
                SetMonth(month + 1);
              }
              await getCompanyList();
            }}
          >
            <Text>下個月</Text>
          </Pressable>
        </View>
        <View className="flex flex-row justify-around my-5">
          <View>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl dark:text-white"
            >
              {data ? data[2].Earn : 0}
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl dark:text-white"
            >
              (比上個月多{data ? data[2].Earn - data[1].Earn : 0})
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl dark:text-white"
            >
              本月營業額
            </Text>
          </View>
          <View>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl dark:text-white"
            >
              {data ? data[2].Count : 0}
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl dark:text-white"
            >
              (比上個月多{data ? data[2].Count - data[1].Count : 0})
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl dark:text-white"
            >
              本月接案數
            </Text>
          </View>
        </View>
        {cj?.map((d) => {
          return <CJBlock CJ={d} key={d.ID} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

export default TurnOver;
