import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { Icon } from "react-native-paper";
import { useAtom } from "jotai";
import { pendingJob } from "../page/Home";
import { callAPI } from "../util/callAPIUtil";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { currentJob } from "../types/JobItemT";

function JobBlockPJ({
  jobItem,
}: {
  jobItem: currentJob | null;
}): React.JSX.Element {
  const ww = Dimensions.get("window").width;
  const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const navigation = useNavigation<ScreenProp>();

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
                try {
                  const res = await callAPI(
                    `/api/claimed/${jobItem.Claimid}`,
                    "DELETE",
                    {},
                    true
                  );
                  if (res.status == 200) {
                    setPendingJob(null);
                  }
                } catch (error) {
                  Alert.alert("糟糕！", "出現了一些問題，請聯絡管理員處理", [
                    { text: "OK" },
                  ]);
                }
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
