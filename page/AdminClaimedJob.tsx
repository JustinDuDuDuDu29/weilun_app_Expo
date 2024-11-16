import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { ClaimedJob, PendingJobUserCmp } from "../types/JobItemT";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "jotai";
import { AlertMe } from "../util/AlertMe";
import { fnAtom } from "../App";
import CJBlock from "../components/CJBlock";

function AdminClaimedJob(): React.JSX.Element {
  const [claimedList, setClaimedList] = useState<PendingJobUserCmp[]>([]); // Default to empty array
  const [expandedCmp, setExpandedCmp] = useState<Set<number>>(new Set());
  const focused = useIsFocused();
  const store = useStore();

  // Toggle fold/unfold for a company
  const toggleFold = (cmpID: number) => {
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

  // Fetch data from the API
  const getData = async () => {
    try {
      const res = await callAPI("/api/claimed/userwitpendingjob", "GET", {}, true);
      if (res.status === 200) {
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setClaimedList(data);
        } else {
          setClaimedList([]); // Safe fallback if data is not in expected format
        }
      }
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
        if (err.message === "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [{ text: "OK", onPress: () => {} }]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  };

  // Fetch the data when page is focused
  useEffect(() => {
    getData();
  }, [focused]);

  const insets = useSafeAreaInsets();

  // Render job list for each user
  const renderJobs = (jobs: ClaimedJob[]) => {
    if (!jobs || jobs.length === 0) return <Text>啥都沒有呢</Text>; // Safe fallback if jobs array is empty or null
    return jobs.map((job) => (
      <CJBlock CJ={job} removeFromList={() => {}} key={job.ID} />
    ));
  };

  // Render user info with the job list
  const renderUser = ({ item }: { item: { userID: number; userName: string; jobs: ClaimedJob[] } }) => (
    <SafeAreaView style={{ marginLeft: 20 }}>
      <Text>{item.userName}</Text>
      {renderJobs(item.jobs)}
    </SafeAreaView>
  );

  // Render company info and toggleable user list
  const renderCmp = ({ item }: { item: PendingJobUserCmp }) => {
    const isExpanded = expandedCmp.has(item.cmpID);
    const users = item.users || []; // Default to empty array if users are null or undefined

    return (
      <SafeAreaView style={{ marginBottom: 16 }}>
        <TouchableOpacity onPress={() => toggleFold(item.cmpID)}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.cmpName}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <FlatList
            data={users} // Use safe empty array for users
            renderItem={renderUser}
            keyExtractor={(user) => user.userID.toString()}
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
      {/* Handle empty or null data */}
      {claimedList && claimedList.length > 0 ? (
        <FlatList
          data={claimedList}
          renderItem={renderCmp}
          keyExtractor={(item) => item.cmpID.toString()}
        />
      ) : (
        <Text>No claimed jobs available</Text> // Handle empty state
      )}
    </SafeAreaView>
  );
}

export default AdminClaimedJob;
