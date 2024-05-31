import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  View,
  Text,
  ListRenderItemInfo,
} from "react-native";
import { Icon } from "react-native-paper";
import { callAPI } from "../util/callAPIUtil";
import { ClaimedJob } from "../types/JobItemT";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function AdminCJ({
  key,
  uid,
  setJobInfo,
  jobInfo,
}: {
  key: string;
  uid: number;
  setJobInfo: Function;
  jobInfo: { string: ClaimedJob[] } | {};
}): React.JSX.Element {
  const [kk, setKK] = useState("");
  useEffect(() => {
    setKK(key);
  }, []);
  if (key) {
    return (
      <SafeAreaView>
        <View key={key}>
          <Pressable
            className={`my-1 rounded-lg px-4 py-2 bg-red-200 flex flex-row justify-between`}
            onPress={async () => {
              const res = await callAPI(
                `/api/claimed?uid=${uid}&ym=${uid}`,
                "GET",
                {},
                true
              );
              const data = await res.json();
              setJobInfo({ ...jobInfo, [key]: data });
              // jobInfo[key] = data;
              setVisible(!visible);
            }}
          >
            <View>
              <Text>{kk}</Text>
            </View>
            <View className={`${visible ? "rotate-180" : "rotate-90"}`}>
              <Icon source={"triangle"} size={15} />
            </View>
          </Pressable>
          {visible ? (
            <FlatList
              data={jobInfo[key]}
              renderItem={(el: ListRenderItemInfo<ClaimedJob>) => {
                return (
                  <Pressable
                    onPress={() => {
                      navigation.navigate("claimJobP", {
                        claimedJob: el.item.ID,
                      });
                    }}
                  >
                    {JSON.stringify(el)}
                  </Pressable>
                );
              }}
            />
          ) : (
            <></>
          )}
        </View>
      </SafeAreaView>
    );
  } else {
    return <></>;
  }
}

export default AdminCJ;
