import React, { useEffect, useState, useCallback } from "react";
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
import JobBlock from "../components/JobBlock"; // Reuse existing JobBlock component
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom, useStore } from "jotai";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";
import { FAB } from "react-native-paper";
import { ScreenProp } from "../types/navigationT";

function JobsScreen(): React.JSX.Element {
  const [getUserInfo] = useAtom(userInfo); // Retrieve user info
  const [data, setData] = useState([]); // Jobs for role `200` or grouped companies for role `100`
  const [expandedCompanies, setExpandedCompanies] = useState<Record<number, boolean>>({}); // Track expansion per company
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const navigation = useNavigation<ScreenProp>();

  const toggleCompanyExpansion = (cmpID: number) => {
    setExpandedCompanies((prevExpanded) => ({
      ...prevExpanded,
      [cmpID]: !prevExpanded[cmpID], // Toggle the expansion state for the specific company
    }));
  };

  const getData = useCallback(async () => {
    try {
      const endpoint = "/api/jobs/all";
      const res = await callAPI(endpoint, "POST", {}, true);
      if (res.status === 200) {
        const fetchedData = await res.json();
        console.log(`fetchedData: ${JSON.stringify(fetchedData)}`);
        setData(fetchedData);
      }
    } catch (err) {
      if (err instanceof Response) {
        err.status === 451
          ? store.get(fnAtom).codefn()
          : AlertMe(err);
      } else if (err instanceof TypeError && err.message === "Network request failed") {
        Alert.alert("糟糕！", "請檢察網路有沒有開", [{ text: "OK" }]);
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK" }]);
      }
    }
  }, [focused]);

  useEffect(() => {
    console.log("getGet")
    if (focused) getData();
  }, [focused]);

  const renderJobs = (jobs) =>
    jobs && jobs.length ? (
      jobs.map((job) => <JobBlock jobItem={job} key={job.ID} />)
    ) : (
      <Text style={styles.emptyText}>No jobs available</Text>
    );

  const renderCompany = ({ item }) => {
    const isExpanded = !!expandedCompanies[item.Belongcmp]; // Get expansion state for the specific company

    return (
      <View>
        <TouchableOpacity onPress={() => toggleCompanyExpansion(item.Belongcmp)} style={styles.companyContainer}>
          <Text style={styles.companyName}>{item.Cmpname}</Text>
        </TouchableOpacity>
        {isExpanded && renderJobs(item.Jobs)}
      </View>
    );
  };

  const renderContent = () => {
    if (getUserInfo?.Role === 100) {
      // Admin view: List of companies with expandable jobs
      return (
        <>
          <FlatList
            data={data}
            renderItem={renderCompany}
            keyExtractor={(item) => item.Belongcmp.toString()}
            contentContainerStyle={styles.list}
          />

        </>
      );
    } else {
      // Driver view: Direct list of jobs
      return (
        <FlatList
          data={data}
          renderItem={({ item }) => <JobBlock jobItem={item} />}
          keyExtractor={(item) => item.ID.toString()}
          contentContainerStyle={styles.list}
        />
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {data && data.length > 0 ? renderContent() : <Text style={styles.emptyText}>No jobs available</Text>}
      {getUserInfo?.Role <= 200 ? <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("CreateJobP")}
      /> : <></>}
    </SafeAreaView>
  );
}

export default JobsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  companyContainer: {
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    backgroundColor: "#fff", // Add background for better visibility
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  list: {
    paddingBottom: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 40,
  },
});
