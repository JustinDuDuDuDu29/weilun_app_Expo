import { RouteProp } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { callAPI } from "../util/callAPIUtil";

function MaintainInfo({
  route,
}: {
  route: RouteProp<{ params: { maintainID: number } }, "params">;
}): React.JSX.Element {
  const [mInfo, setMInfo] = useState();
  const getData = useCallback(async () => {
    const res = await callAPI(
      `/api/repair/${route.params.maintainID}`,
      "GET",
      {},
      true
    );
    console.log(res.status);
    const data = await res.json();
    console.log(data);
  }, []);
  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text className="dark:text-white text-xl">
          維修編號：{route.params.maintainID}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default MaintainInfo;
