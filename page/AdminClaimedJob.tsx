import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { ClaimedJob, PendingJobUserCmp } from "../types/JobItemT";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "jotai";
import { AlertMe } from "../util/AlertMe";
import { fnAtom } from "../App";
import CJBlock from "../components/CJBlock";

function AdminClaimedJob(): React.JSX.Element {
  const [claimedList, setClaimedList] = useState<PendingJobUserCmp[]>([]);
  const [expandedCmp, setExpandedCmp] = useState<Set<number>>(new Set());
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const focused = useIsFocused();
  const store = useStore();

  const toggleFoldCmp = (cmpID: number) => {
    setExpandedCmp((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      newExpanded.has(cmpID) ? newExpanded.delete(cmpID) : newExpanded.add(cmpID);
      return newExpanded;
    });
  };

  const toggleFoldUser = (userID: number) => {
    setExpandedUsers((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      newExpanded.has(userID) ? newExpanded.delete(userID) : newExpanded.add(userID);
      return newExpanded;
    });
  };

  const getData = async () => {
    try {
      const res = await callAPI("/api/claimed/userwitpendingjob", "GET", {}, true);
      if (res.status === 200) {
        const data = await res.json();
        setClaimedList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      if (err instanceof Response) {
        if (err.status === 451) store.get(fnAtom).codefn();
        else AlertMe(err);
      } else if (err instanceof TypeError && err.message === "Network request failed") {
        Alert.alert("糟糕！", "請檢察網路有沒有開", [{ text: "OK" }]);
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK" }]);
      }
    }
  };

  useEffect(() => {
    console.log("Getting")
    getData();
  }, [focused]);

  const insets = useSafeAreaInsets();

  const renderJobs = (jobs: ClaimedJob[]) => {
    if (!jobs || jobs.length === 0) {
      return <Text allowFontScaling={false}style={styles.emptyText} className="dark:text-white text-2xl">No jobs available</Text>;
    }
    return jobs.map((job) => (
      <CJBlock CJ={job} removeFromList={() => {}} key={job.ID} />
    ));
  };

  const renderUser = ({ item }: { item: { userID: number; userName: string; jobs: ClaimedJob[] } }) => {
    const isUserExpanded = expandedUsers.has(item.userID);

    return (
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={() => toggleFoldUser(item.userID)}>
          <Text allowFontScaling={false}style={styles.userName} className="dark:text-white text-2xl">{item.userName}</Text>
        </TouchableOpacity>
        {isUserExpanded && renderJobs(item.jobs)}
      </View>
    );
  };

  const renderCmp = ({ item }: { item: PendingJobUserCmp }) => {
    const isCmpExpanded = expandedCmp.has(item.cmpID);
    const users = item.users || [];

    return (
      <View style={styles.companyContainer}>
        <TouchableOpacity onPress={() => toggleFoldCmp(item.cmpID)}>
          <Text allowFontScaling={false}style={styles.companyName} className="dark:text-white text-2xl">{item.cmpName}</Text>
        </TouchableOpacity>
        {isCmpExpanded && (
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(user) => user.userID.toString()}
            contentContainerStyle={styles.userList}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {claimedList && claimedList.length > 0 ? (
        <FlatList
          data={claimedList}
          renderItem={renderCmp}
          keyExtractor={(item) => item.cmpID.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text allowFontScaling={false}style={styles.emptyText} className="dark:text-white text-2xl">No claimed jobs available</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8f9fa",
  },
  list: {
    padding: 16,
  },
  companyContainer: {
    marginBottom: 16,
    // backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "600",
    // color: "#333",
    marginBottom: 8,
  },
  userContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    // color: "#555",
    marginBottom: 4,
  },
  userList: {
    paddingLeft: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    // color: "#888",
    marginTop: 32,
  },
});

export default AdminClaimedJob;
