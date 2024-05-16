import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { callAPI } from "../util/callAPIUtil";
import { revT } from "../types/revenueT";
import { LineChart } from "react-native-gifted-charts";
import CJBlock from "../components/CJBlock";
import { useAtom } from "jotai";
import { userInfo } from "./Home";
import { ClaimedJob } from "../types/JobItemT";

function TurnOver(): React.JSX.Element {
  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const ww = Dimensions.get("window").width;
  const hh = Dimensions.get("window").height;
  const [data, setData] = useState<revT[]>();
  const [gDate, setGData] = useState<[]>();
  const [max, setMax] = useState<number>(0);
  const [cj, setCJ] = useState<ClaimedJob[]>();

  const getData = useCallback(async () => {
    const res = await callAPI("/api/revenue", "GET", {}, true);
    const data = await res.json();
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
    const cj = await (
      await callAPI(`/api/claimed/list?id=${getUserInfo?.ID}`, "GET", {}, true)
    ).json();
    setCJ(cj);
  }, []);

  useEffect(() => {
    getData();
  }, []);
  const navigation = useNavigation();
  return (
    <SafeAreaView className="px-3 my-2">
      <ScrollView>
        <View className="bg-gray-200 px-5" style={{}}>
          <LineChart
            initialSpacing={25}
            data={gDate}
            height={hh / 4}
            spacing={ww / 3}
            textFontSize={15}
            // off
            textShiftX={14}
            thickness={5}
            hideRules
            maxValue={max + max / 10}
            hideYAxisText
            yAxisColor="#0BA5A4"
            yAxisExtraHeight={30}
            yAxisThickness={0}
            verticalLinesColor="rgba(14,164,164,0.5)"
            xAxisColor="#0BA5A4"
            color="#0BA5A4"
          />
        </View>
        <View className="flex flex-row justify-around my-5">
          <View>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl"
            >
              {data ? data[2].Earn : 0}
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl"
            >
              (比上個月{data ? data[2].Earn - data[1].Earn : 0})
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl"
            >
              本月營業額
            </Text>
          </View>
          <View>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl"
            >
              {data ? data[2].Count : 0}
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl"
            >
              (比上個月{data ? data[2].Count - data[1].Count : 0})
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl"
            >
              本月接案數
            </Text>
          </View>
        </View>
        {cj?.map((d) => {
          return <CJBlock CJ={d} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

export default TurnOver;
