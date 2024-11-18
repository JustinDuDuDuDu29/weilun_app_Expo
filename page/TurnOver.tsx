import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { cmpJobT } from "../types/revenueT";
import CmpJobBlock from "../components/CmpJobBlock";

function TurnOver(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [cmps, setCmps] = useState<cmpJobT[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

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
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    getCompanyList();
  }, [year, month]);

  const handlePrevMonth = () => {
    setMonth((prev) => (prev === 1 ? 12 : prev - 1));
    if (month === 1) setYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setMonth((prev) => (prev === 12 ? 1 : prev + 1));
    if (month === 12) setYear((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handlePrevMonth}>
          <Text>上個月</Text>
        </Pressable>
        <Text>{year} / {month}</Text>
        <Pressable onPress={handleNextMonth}>
          <Text>下個月</Text>
        </Pressable>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={cmps}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => <CmpJobBlock cmpJob={item} />}
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
});
