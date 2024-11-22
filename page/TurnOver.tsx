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
        <Pressable onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{"< 上個月"}</Text>
        </Pressable>
        <Text style={styles.dateText}>
          {year} / {month.toString().padStart(2, "0")}
        </Text>
        <Pressable onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{"下個月 >"}</Text>
        </Pressable>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : cmps.length > 0 ? (
        <FlatList
          data={cmps}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => (
            <CmpJobBlock cmpJob={item} year={year} month={month} />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available for this month.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default TurnOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007bff",
  },
  navButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
