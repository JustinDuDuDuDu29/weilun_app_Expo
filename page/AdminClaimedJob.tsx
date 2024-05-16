import React, { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text } from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { ClaimedJob } from "../types/JobItemT";
import AlertBlock from "../components/AlertBlock";
import CJBlock from "../components/CJBlock";

function AdminClaimedJob(): React.JSX.Element {
  const [claimedList, setClaimedList] = useState<ClaimedJob[]>([]);

  const getData = useCallback(async () => {
    try {
      const res = await callAPI("/api/claimed", "GET", {}, true);
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
  });

  return (
    <SafeAreaView>
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
