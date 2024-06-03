import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { useStore } from "jotai";
import { callAPI } from "../util/callAPIUtil";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { currentJob } from "../types/JobItemT";
import { fnAtom } from "../App";
import { err } from "react-native-svg";
import { AlertMe } from "../util/AlertMe";

function JobBlockPJ({
  jobItem,
}: {
  jobItem: currentJob | null;
}): React.JSX.Element {
  const store = useStore();
  const ww = Dimensions.get("window").width;
  const navigation = useNavigation<ScreenProp>();

  const cancel = async (id: number) => {
    try {
      const res = await callAPI(`/api/claimed/${id}`, "DELETE", {}, true);
      if (!res.ok) throw err;
      if (res.status == 200) {
        store.get(fnAtom).setPJfn(null);
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
  };

  if (!jobItem) {
    return <></>;
  }
  return (
    <SafeAreaView>
      <Pressable
        className="bg-yellow-300 my-3 rounded-2xl w-full flex flex-col justify-center content-center  px-9 py-2"
        onLongPress={() => {
          // cancel job
          Alert.alert("取消工作", "確定要取消這個工作嗎？", [
            {
              text: "確定取消",
              onPress: async () => {
                await cancel(jobItem?.Claimid);
              },
            },
            { text: "不要取消", onPress: () => {} },
          ]);
        }}
        onPress={() => {
          // finish job
          navigation.navigate("finishJobP");
        }}
      >
        <View className="flex flex-row py-2">
          <View className="flex justify-center content-center flex-1">
            <Text
              style={{ textAlign: "center", verticalAlign: "middle" }}
              className="text-3xl"
            >
              {jobItem.FromLoc}
            </Text>
          </View>
          <View className="flex justify-center content-center">
            <Text
              style={{ textAlign: "center", verticalAlign: "middle" }}
              className="text-3xl"
            >
              ➡
            </Text>
          </View>
          {jobItem.Mid.Valid ? (
            <>
              <View className="flex justify-center content-center flex-1">
                <Text
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  className="text-3xl"
                >
                  {jobItem.Mid.String}
                </Text>
              </View>

              <View className="flex justify-center content-center">
                <Text
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  className="text-3xl"
                >
                  ➡
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}

          <View className="flex justify-center content-center flex-1">
            <Text
              style={{ textAlign: "center", verticalAlign: "middle" }}
              className="text-3xl "
            >
              {jobItem.ToLoc}
            </Text>
          </View>
        </View>
        {jobItem.Memo.Valid ? (
          <View className="bg-slate-100 rounded-xl px-2 my-2">
            <View className="my-1">
              <Text
                style={{ textAlign: "center", verticalAlign: "middle" }}
                className="text-xl"
              >
                注意事項：{jobItem.Memo.String}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

export default JobBlockPJ;
