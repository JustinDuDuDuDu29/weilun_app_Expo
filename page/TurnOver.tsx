import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Text,
  useColorScheme as usc,
  ScrollView,
  Alert,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { callAPI } from "../util/callAPIUtil";
import { revT } from "../types/revenueT";
import { LineChart } from "react-native-gifted-charts";
import CJBlock from "../components/CJBlock";
import { useAtom, useStore } from "jotai";
import { ClaimedJob } from "../types/JobItemT";
import { SplashScreen } from "../components/Aplash";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function TurnOver(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const ww = Dimensions.get("window").width;
  const hh = Dimensions.get("window").height;
  const [data, setData] = useState<revT[]>();
  const [gDate, setGData] = useState<[]>();
  const [max, setMax] = useState<number>(0);
  const [cj, setCJ] = useState<ClaimedJob[]>();

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
      let max = -100;
      const aa = data?.map((d: revT, i: number) => {
        if (d.Earn > max) setMax(d.Earn);
        return {
          value: d.Earn,
          dataPointText: d.Earn.toString(),
          label: `${new Date().getFullYear()}/${new Date().getMonth() - 1 + i}`,
        };
      });

      setGData(aa);
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

  useEffect(() => {
    getData();
  }, [isFocus]);
  const navigation = useNavigation();
  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <SafeAreaView className="px-3 my-2">
      <ScrollView>
        <View className=" px-5">
          <LineChart
            backgroundColor={cS == "light" ? "white" : "#3A3B3C"}
            initialSpacing={25}
            data={gDate}
            height={hh / 4}
            spacing={ww / 3}
            textFontSize={15}
            textShiftX={14}
            thickness={5}
            hideRules
            maxValue={100 + max + max / 10}
            hideYAxisText
            yAxisColor={cS == "light" ? "white" : "#3A3B3C"}
            xAxisColor={cS == "light" ? "#3A3B3C" : "white"}
            color="#0BA5A4"
          />
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
