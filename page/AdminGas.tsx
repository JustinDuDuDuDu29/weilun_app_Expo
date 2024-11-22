import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { maintainInfoT, mCmpUserT } from "../types/maintainT";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertMe } from "../util/AlertMe";
import GasBlock from "../components/GasBlock";
import { useStore } from "jotai";
import { fnAtom } from "../App";

function Gas(): React.JSX.Element {
  const [cmpList, setCmpList] = useState<mCmpUserT[]>([]);
  const [expandedCmp, setExpandedCmp] = useState<Set<number>>(new Set());
  const [expandedDrivers, setExpandedDrivers] = useState<Map<number, maintainInfoT[]>>(new Map());
  const focused = useIsFocused();
  const store = useStore();
  const insets = useSafeAreaInsets();

  const toggleFoldCmp = (cmpID: number) => {
    setExpandedCmp((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      newExpanded.has(cmpID) ? newExpanded.delete(cmpID) : newExpanded.add(cmpID);
      return newExpanded;
    });
  };

  const toggleFoldDriver = async (driverID: number) => {
    if (expandedDrivers.has(driverID)) {
      setExpandedDrivers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(driverID);
        return newMap;
      });
    } else {
      try {
        const res = await callAPI(`/api/gas?cat=pending&driverid=${driverID}`, "GET", {}, true);
        if (res.status === 200) {
          const jobs = await res.json();
          console.log(jobs)
          setExpandedDrivers((prev) => new Map(prev).set(driverID, jobs.res));
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  const getData = async () => {
    try {
      const res = await callAPI("/api/gas/cmpUser", "GET", {}, true);
      if (res.status === 200) {
        const data = await res.json();
        console.log(data)
        setCmpList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: unknown) => {
    if (err instanceof Response) {
      err.status === 451
        ? store.get(fnAtom).codefn()
        : AlertMe(err);
    } else if (err instanceof TypeError && err.message === "Network request failed") {
      Alert.alert("糟糕！", "請檢察網路有沒有開", [{ text: "OK" }]);
    } else {
      Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK" }]);
    }
  };

  useEffect(() => {
    getData();
  }, [focused]);

  const renderJobs = (jobs: maintainInfoT[]) =>
    jobs && jobs.length ? (
      jobs.map((job) => <GasBlock gasInfo={job} key={job.ID} />)
    ) : (
      <Text className="dark:text-white" style={styles.emptyText}>No gas jobs available</Text>
    );

  const renderDriver = ({ item }: { item: { driverID: number; driverName: string } }) => {
    const isDriverExpanded = expandedDrivers.has(item.driverID);
    const jobs = expandedDrivers.get(item.driverID);

    return (
      <View style={styles.driverContainer}>
        <TouchableOpacity onPress={() => toggleFoldDriver(item.driverID)}>
          <Text className="dark:text-white" style={styles.driverText}>{item.driverName}</Text>
        </TouchableOpacity>
        {isDriverExpanded && jobs && renderJobs(jobs)}
      </View>
    );
  };

  const renderCmp = ({ item }: { item: mCmpUserT }) => {
    const isCmpExpanded = expandedCmp.has(item.cmpId);
    const drivers = item.users || [];

    return (
      <View style={styles.cmpContainer}>
        <TouchableOpacity onPress={() => toggleFoldCmp(item.cmpId)}>
          <Text style={styles.cmpText} className="dark:text-white">{item.cmpName}</Text>
        </TouchableOpacity>
        {isCmpExpanded && (
          <FlatList
            data={drivers}
            renderItem={renderDriver}
            keyExtractor={(driver) => driver.driverID.toString()}
            contentContainerStyle={styles.driverList}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {cmpList && cmpList.length > 0 ? (
        <FlatList
          data={cmpList}
          renderItem={renderCmp}
          keyExtractor={(item) => item.cmpId.toString()}
          contentContainerStyle={styles.cmpList}
        />
      ) : (
        <Text style={styles.emptyText} className="dark:text-white">No gas jobs available</Text>
      )}
    </SafeAreaView>
  );
}

export default Gas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f4f4f8",
  },
  cmpContainer: {
    // backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 2,
  },
  cmpText: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "#333",
  },
  driverContainer: {
    marginLeft: 16,
    marginTop: 10,
  },
  driverText: {
    fontSize: 16,
    // color: "#555",
    fontWeight: "500",
  },
  driverList: {
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    // color: "#888",
    fontSize: 16,
  },
  cmpList: {
    paddingBottom: 16,
  },
});
