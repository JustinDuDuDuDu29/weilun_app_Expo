import React, { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text } from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { ClaimedJob } from "../types/JobItemT";
import AlertBlock from "../components/AlertBlock";
import CJBlock from "../components/CJBlock";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AdminClaimedJob(): React.JSX.Element {
  const [claimedList, setClaimedList] = useState<ClaimedJob[]>([]);
  const focused = useIsFocused();

  const getData = useCallback(async () => {
    try {
      const res = await callAPI("/api/claimed?cat=pending", "GET", {}, true);
      if (res.status == 200) {
        const data = await res.json();
        setClaimedList(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [focused]);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className="flex flex-col relative flex-1 mx-4"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <FlatList
        className="h-full"
        data={claimedList}
        renderItem={({ item }) => {
          return <CJBlock CJ={item} />;
        }}
        keyExtractor={(item) => item.ID.toString()}
      />
    </SafeAreaView>
  );
}

export default AdminClaimedJob;
