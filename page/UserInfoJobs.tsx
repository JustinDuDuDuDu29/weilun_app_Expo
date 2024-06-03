import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
  Alert,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { Icon } from "react-native-paper";
import { ClaimedJob } from "../types/JobItemT";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import CJBlock from "../components/CJBlock";
import { useStore } from "jotai";
import { fnAtom } from "../App";
import { AlertMe } from "../util/AlertMe";

function UserInfoJobs({ uid }: { uid: number }): React.JSX.Element {
  const store = useStore();

  const [jobInfo, setJobInfo] = useState<{ [key: string]: ClaimedJob[] }>({});
  const [dd, setData] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({});

  const getData = useCallback(async () => {
    try {
      const res = await callAPI(`/api/claimed/cj?id=${uid}`, "GET", {}, true);
      if (!res.ok) {
        throw res;
      }
      const data: string[] = await res.json();

      setData(data);
      data.forEach((e) => {
        setJobInfo((oldArray) => ({ ...oldArray, [e]: [] }));
        setVisibility((oldVisibility) => ({ ...oldVisibility, [e]: false }));
      });
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
      }
      if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  }, [uid]);

  useEffect(() => {
    getData();
  }, [getData]);

  const navigation = useNavigation<ScreenProp>();

  const toggleVisibility = async (key: string) => {
    if (!visibility[key]) {
      if (jobInfo[key].length == 0) {
        try {
          const res = await callAPI(
            `/api/claimed?uid=${uid}&ym=${key}`,
            "GET",
            {},
            true
          );
          if (!res.ok) throw res;
          const data = await res.json();
          setJobInfo({ ...jobInfo, [key]: data });
        } catch (error) {
          if (error instanceof Response) {
            switch (error.status) {
              case 451:
                store.get(fnAtom).codefn();
                break;

              default:
                AlertMe(error);
                break;
            }
          }
        }
      }
    }
    setVisibility({ ...visibility, [key]: !visibility[key] });
  };

  return (
    <SafeAreaView>
      <View className="py-4 px-3">
        <FlatList
          data={dd}
          keyExtractor={(item) => item}
          renderItem={({ item: key }) => (
            <View key={key}>
              <Pressable
                className="my-1 rounded-lg px-4 py-2 bg-red-200 flex flex-row justify-between"
                onPress={() => toggleVisibility(key)}
              >
                <View>
                  <Text>{key}</Text>
                </View>
                <View
                  className={`${visibility[key] ? "rotate-180" : "rotate-90"}`}
                >
                  <Icon source={"triangle"} size={15} />
                </View>
              </Pressable>
              {visibility[key] && (
                <FlatList
                  data={jobInfo[key]}
                  keyExtractor={(item) => item.ID.toString()}
                  renderItem={(el: ListRenderItemInfo<ClaimedJob>) => (
                    <CJBlock CJ={el.item} />
                  )}
                />
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default UserInfoJobs;
