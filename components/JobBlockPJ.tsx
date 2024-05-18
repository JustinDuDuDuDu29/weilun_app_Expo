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
import { NullString, currentJob, jobItemT } from "../types/JobItemT";

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
        onLongPress={() => {
          // cancel job
          Alert.alert("取消工作", "確定要取消這個工作嗎？", [
            {
              text: "確定取消",
              onPress: async () => {
                try {
                  const res = await await callAPI(
                    `/api/claimed/${jobItem.ID}`,
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
        <View className="bg-yellow-300 my-3 rounded-2xl w-full flex flex-row justify-center content-center">
          <View
            style={{ flex: 0.3, flexBasis: 0.3 }}
            className="flex justify-center content-center"
          >
            <Text style={{ textAlign: "center" }} className="text-3xl">
              {jobItem!.FromLoc}
            </Text>
          </View>

          <View
            style={{ flex: 0.3, flexBasis: 0.3 }}
            className="flex justify-center items-center content-center relative"
          >
            <Text
              style={{ textAlign: "center" }}
              className=" absolute text-white z-50"
            >
              {jobItem instanceof String
                ? (jobItem.Mid as string)
                : ((jobItem.Mid as NullString).String as string)}
            </Text>
            <Icon source="arrow-right-bold" size={ww * 0.25} />
          </View>
          <View
            style={{ flex: 0.3, flexBasis: 0.3 }}
            className="flex justify-center content-center"
          >
            <Text style={{ textAlign: "center" }} className="text-3xl">
              {jobItem!.ToLoc}
            </Text>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default JobBlockPJ;
