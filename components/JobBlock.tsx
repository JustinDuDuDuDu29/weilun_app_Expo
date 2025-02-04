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
import { useAtom, useStore } from "jotai";
// import { pendingJob, userInfo } from "../page/Home";
import { callAPI } from "../util/callAPIUtil";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function JobBlock({ jobItem }: { jobItem: jobItemT }): React.JSX.Element {
  const store = useStore();
  const ww = Dimensions.get("window").width;
  // const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <Pressable
        className="bg-green-300 my-3 rounded-2xl w-full flex flex-col px-4 py-3"
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
              } else throw res;
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
              } else if (err instanceof TypeError) {
                if (err.message == "Network request failed") {
                  Alert.alert("糟糕！", "請檢察網路有沒有開", [
                    { text: "OK", onPress: () => {} },
                  ]);
                }
              } else {
                Alert.alert("GG", `怪怪\n${err}`, [
                  { text: "OK", onPress: () => {} },
                ]);
              }
            }
          } else if (getUserInfo?.Role <= 200) {
            navigation.navigate("jobUpdateP", { jobItem: jobItem });
          }
        }}
      >
        <View className="flex flex-row py-2">
          <View className="flex justify-center content-center flex-1">
            <Text allowFontScaling={false}style={{ textAlign: "center" }} className="text-3xl">
              {jobItem.Fromloc}
            </Text>
          </View>
          <View className="flex justify-center content-center">
            <Text allowFontScaling={false}style={{ textAlign: "center" }} className="text-3xl">
              ➡
            </Text>
          </View>
          {jobItem.Mid?.Valid ?? jobItem.Mid  ? (
            <>
              <View className="flex justify-center content-center flex-1">
                <Text allowFontScaling={false}style={{ textAlign: "center" }} className="text-3xl">
                  {jobItem.Mid.String ?? jobItem.Mid }
                </Text>
              </View>

              <View className="flex justify-center content-center">
                <Text allowFontScaling={false}style={{ textAlign: "center" }} className="text-3xl">
                  ➡
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}

          <View className="flex justify-center content-center flex-1">
            <Text allowFontScaling={false}style={{ textAlign: "center" }} className="text-3xl ">
              {jobItem.Toloc}
            </Text>
          </View>
        </View>
        <View className="bg-slate-100 rounded-xl px-2 my-2">
          {jobItem.Memo?.Valid ?? jobItem.Memo ? (
            <View className="my-1">
              <Text allowFontScaling={false}className="text-xl">注意事項：{jobItem.Memo.String ?? jobItem.Memo}</Text>
            </View>
          ) : (
            <></>
          )}
          {jobItem.Price ? (
            <View className="my-1">
              <Text allowFontScaling={false}className="text-xl">運費：{jobItem.Price}</Text>
            </View>
          ) : (
            <></>
          )}
          {jobItem.Remaining ? (
            <View className="my-1">
              <Text allowFontScaling={false}className="text-xl">
                剩餘趟數：
                {jobItem.Remaining > 2000000 ? "無限多趟" : jobItem.Remaining}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {jobItem.Source ? (
            <View className="my-1">
              <Text allowFontScaling={false}className="text-xl">業主：{jobItem.Source}</Text>
            </View>
          ) : (
            <></>
          )}
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default JobBlock;
