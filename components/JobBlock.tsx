import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { NullString, jobItemT } from "../types/JobItemT";
import { Icon } from "react-native-paper";
import { useAtom } from "jotai";
import { pendingJob, userInfo } from "../page/Home";
import { callAPI } from "../util/callAPIUtil";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function JobBlock({ jobItem }: { jobItem: jobItemT }): React.JSX.Element {
  const ww = Dimensions.get("window").width;
  const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <Pressable
        // style={{
        //   backgroundColor:
        //     getPendingJob!.ID == jobItem.ID
        //       ? 'rgb(254 249 195)'
        //       : 'rgb(167 243 208)',
        // }}
        className="bg-green-300 my-3 rounded-2xl w-full flex flex-row justify-center content-center"
        onPress={async () => {
          // driver press to claim job
          if (getUserInfo?.Role == 300) {
            try {
              const res = await callAPI(
                `/api/claimed/${jobItem.ID}`,
                "POST",
                {},
                true
              );

              if (res.status == 409) {
                Alert.alert(
                  "不能貪心喔～",
                  "你已經有一項進行中的工作，請先取消或完成該作業",
                  [
                    {
                      text: "OK",
                    },
                  ]
                );
              } else if (res.status == 200) {
                Alert.alert(
                  "成功！",
                  "快去進行工作吧\n注意，如要取消，請於接取後的五分鐘內取消，或是通知管理人員處例",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.log(error);
            }
          } else if (getUserInfo?.Role == 100) {
            navigation.navigate("jobUpdateP", { jobItem: jobItem });
          }
        }}
      >
        <View
          style={{ flex: 0.3, flexBasis: 0.3 }}
          className="flex justify-center content-center"
        >
          <Text style={{ textAlign: "center" }} className="text-3xl">
            {jobItem.FromLoc}
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
          <Icon source="arrow-right-bold" size={ww * 0.3} />
        </View>
        <View
          style={{ flex: 0.3, flexBasis: 0.3 }}
          className="flex justify-center content-center"
        >
          <Text style={{ textAlign: "center" }} className="text-3xl">
            {jobItem.ToLoc}
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default JobBlock;
