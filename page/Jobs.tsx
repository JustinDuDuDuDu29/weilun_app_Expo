import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  View,
  Text,
} from "react-native";
import _data from "../asset/fakeData/_jobs.json";
import { jobItemT } from "../types/JobItemT";
import JobBlock from "../components/JobBlock";
import { useAtom, useStore } from "jotai";
// import { pendingJob } from "./Home";
import { callAPI } from "../util/callAPIUtil";
import { NullDate } from "../types/userT";
import { useIsFocused } from "@react-navigation/native";
import { fnAtom, pendingJob } from "../App";

function Jobs(): React.JSX.Element {
  const store = useStore();

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState();
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callAPI("/api/jobs/all", "POST", {}, true);
        if (!res.ok) throw res.status;
        const allJobs = await res.json();

        setData(allJobs);
      } catch (error) {
        if (error instanceof Number) {
          store.get(fnAtom).codefn(error);
        }
      }
    };

    fetchData();
  }, [useIsFocused]);

  const getData = async () => {
    setRefreshing(true);
    await new Promise(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    });
  };

  return (
    <SafeAreaView>
      <View className="px-4">
        <FlatList
          data={data}
          // refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getData()}
            />
          }
          renderItem={({ item }: { item: jobItemT }) =>
            !(item.CloseDate as NullDate)?.Valid && !(item.Remaining == 0) ? (
              <JobBlock jobItem={item} />
            ) : (
              <></>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

export default Jobs;
