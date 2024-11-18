import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { maintainInfoT, mCmpUserT, mInfoT } from "../types/maintainT";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertMe } from "../util/AlertMe";
import MaintainBlock from "../components/MaintainBlock";
import { useStore } from "jotai";
import { fnAtom } from "../App";

function Maintain(): React.JSX.Element {
  const [cmpList, setCmpList] = useState<mCmpUserT[]>([]);
  const [expandedCmp, setExpandedCmp] = useState<Set<number>>(new Set());
  const [expandedDrivers, setExpandedDrivers] = useState<Map<number, maintainInfoT[]>>(new Map());
  const focused = useIsFocused();
  const store = useStore();
  const insets = useSafeAreaInsets();

  // Toggle fold/unfold for a company
  const toggleFoldCmp = (cmpID: number) => {
    setExpandedCmp((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(cmpID)) {
        newExpanded.delete(cmpID);
      } else {
        newExpanded.add(cmpID);
      }
      return newExpanded;
    });
  };

  // Toggle fold/unfold for a driver and fetch jobs if not already fetched
  const toggleFoldDriver = async (driverID: number) => {
    if (expandedDrivers.has(driverID)) {
      setExpandedDrivers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(driverID);
        return newMap;
      });
    } else {
      try {
        const res = await callAPI(`/api/repair?cat=pending&driverid=${driverID}`, "GET", {}, true);
        if (res.status === 200) {
          const jobs = await res.json();
          setExpandedDrivers((prev) => new Map(prev).set(driverID, jobs.res));
        }
      } catch (err) {
        handleError(err);
      }
    }
  };

  // Fetch the list of companies and drivers from the API
  const getData = async () => {
    try {
      const res = await callAPI("/api/repair/cmpUser", "GET", {}, true);
      if (res.status === 200) {
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setCmpList(data);
        } else {
          setCmpList([]);
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: unknown) => {
    if (err instanceof Response) {
      switch (err.status) {
        case 451:
          store.get(fnAtom).codefn();
          break;
        default:
          AlertMe(err);
          break;
      }
    } else if (err instanceof TypeError && err.message === "Network request failed") {
      Alert.alert("糟糕！", "請檢察網路有沒有開", [{ text: "OK", onPress: () => { } }]);
    } else {
      Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => { } }]);
    }
  };

  // Fetch data when the component is focused
  useEffect(() => {
    getData();
  }, [focused]);

  // Render the list of repair jobs for each driver
  const renderJobs = (jobs: maintainInfoT[]) => {
    if (!jobs || jobs.length === 0) return <Text>啥都沒有呢</Text>;
    return jobs.map((job) => (
      <MaintainBlock maintainInfo={job} key={job.ID} />
    ));
  };

  // Render driver info with their jobs
  const renderDriver = ({
    item,
  }: {
    item: { driverID: number; driverName: string };
  }) => {
    const isDriverExpanded = expandedDrivers.has(item.driverID);
    const jobs = expandedDrivers.get(item.driverID);

    return (
      <SafeAreaView style={{ marginLeft: 20, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => toggleFoldDriver(item.driverID)}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.driverName}</Text>
        </TouchableOpacity>
        {isDriverExpanded && jobs && renderJobs(jobs)}
      </SafeAreaView>
    );
  };

  // Render company info with a list of drivers
  const renderCmp = ({ item }: { item: mCmpUserT }) => {
    const isCmpExpanded = expandedCmp.has(item.cmpId);
    const drivers = item.users || [];

    return (
      <SafeAreaView style={{ marginBottom: 16 }}>
        <TouchableOpacity onPress={() => toggleFoldCmp(item.cmpId)}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.cmpName}</Text>
        </TouchableOpacity>

        {isCmpExpanded && (
          <FlatList
            data={drivers}
            renderItem={renderDriver}
            keyExtractor={(driver) => driver.driverID.toString()}
          />
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {cmpList && cmpList.length > 0 ? (
        <FlatList
          data={cmpList}
          renderItem={renderCmp}
          keyExtractor={(item) => item.cmpId.toString()}
        />
      ) : (
        <Text>No repair jobs available</Text>
      )}
    </SafeAreaView>
  );
}

export default Maintain;
