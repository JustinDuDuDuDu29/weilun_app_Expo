import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { callAPI } from "../util/callAPIUtil";
import { cmpJobT, revT } from "../types/revenueT";
import { useAtom, useStore } from "jotai";
import { fnAtom, userInfo } from "../App";
import CmpJobBlock from "../components/CmpJobBlock";
import { AlertMe } from "../util/AlertMe";

function TurnOver(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [getUserInfo] = useAtom(userInfo);
  const ww = Dimensions.get("window").width;
  const [data, setData] = useState<revT[]>();
  const [gDate, setGData] = useState<[]>([]);
  const [cmps, setCmps] = useState<cmpJobT[]>([]);
  const [max, setMax] = useState<number>(-100);
  const [year, SetYear] = useState<number>(new Date().getFullYear());
  const [month, SetMonth] = useState<number>(new Date().getMonth() + 1);
  const store = useStore();
  const isFocus = useIsFocused();

  // Function to fetch company list with error handling
  const getCompanyList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await callAPI(
        `/api/cmp/job?year=${year}&month=${month}`,
        "GET",
        {},
        true
      );
      const res = await response.json();
      setCmps(res);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

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
        if (err.message === "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `發生未知錯誤\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  }, [year, month]);

  useEffect(() => {
    console.log('calling')
    getCompanyList();
  }, [isFocus, year, month]);

  const handlePrevMonth = async () => {
    if (month - 1 === 0) {
      SetMonth(12);
      SetYear(year - 1);
    } else {
      SetMonth(month - 1);
    }
    // await getCompanyList();
  };

  const handleNextMonth = async () => {
    if (month + 1 === 13) {
      SetMonth(1);
      SetYear(year + 1);
    } else {
      SetMonth(month + 1);
    }
    // await getCompanyList();
  };

  const renderCmpJobBlock = ({ item }: { item: cmpJobT }) => (
    <CmpJobBlock cmpJob={item} key={item.ID} year={year} month={month} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={cmps}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={renderCmpJobBlock}
          ListHeaderComponent={
            <View style={styles.header}>
              <Pressable onPress={handlePrevMonth}>
                <Text>上個月</Text>
              </Pressable>
              <Text>{year} / {month}</Text>
              <Pressable onPress={handleNextMonth}>
                <Text>下個月</Text>
              </Pressable>
              {/* <View style={styles.revenueContainer}>
                <View style={styles.revenueBox}>
                  <Text style={styles.revenueText}>{data ? data[2]?.Earn : 0}</Text>
                  <Text style={styles.revenueText}>
                    (比上個月多 {data ? data[2]?.Earn - data[1]?.Earn : 0})
                  </Text>
                  <Text>本月營業額</Text>
                </View>
                <View style={styles.revenueBox}>
                  <Text style={styles.revenueText}>{data ? data[2]?.Count : 0}</Text>
                  <Text style={styles.revenueText}>
                    (比上個月多 {data ? data[2]?.Count - data[1]?.Count : 0})
                  </Text>
                  <Text>本月接案數</Text>
                </View>
              </View> */}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

export default TurnOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  revenueContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  revenueBox: {
    alignItems: "center",
  },
  revenueText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
