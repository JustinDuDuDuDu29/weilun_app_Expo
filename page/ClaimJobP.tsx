import React, { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useAtom, useStore } from "jotai";
import { CJInfo } from "../types/JobItemT";
import { callAPI, GIBEDEIMGB0SS } from "../util/callAPIUtil";
import { ScreenProp } from "../types/navigationT";
import { imgUrl } from "../types/ImgT";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";
import UploadPicFCJob from "../components/UploadPicFCJob";

function ClaimJobP({
  route,
}: {
  route: RouteProp<
    { params: { claimedJob: number; removeFromList: Function } },
    "params"
  >;
}): React.JSX.Element {
  const [getUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();
  const [jobPic, setJobPic] = useState<imgUrl | null>(null);
  const [CJ, setCJ] = useState<CJInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const store = useStore();
  const approveJobFun = async () => {
    try {
      const call = await callAPI(
        `/api/claimed/approve/${CJ?.ID}`,
        "POST",
        {},
        true
      );
      if (call.status == 200) {
        Alert.alert("完成", "核可資料成功");
        getData();
        route.params.removeFromList(CJ?.ID);
      }
    } catch (error) {
      console.error("Error approving job: ", error);
    }
  };
  const getData = useCallback(async () => {
    try {
      const res = await callAPI(`/api/claimed?cjID=${route.params.claimedJob}`, "GET", {}, true);
      if (!res.ok) {
        throw res;
      }

      const data: CJInfo[] = await res.json();
      if (data[0].Finishpic.Valid) {
        const src = await GIBEDEIMGB0SS(`/api/static/img/${data[0].Finishpic.String}`);
        setJobPic(src);
      }
      setCJ(data[0]);
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
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => { } }]);
      }
    } finally {
      setLoading(false);
    }
  }, [route.params.claimedJob]);

  const deleteJobFun = async () => {
    try {
      const call = await callAPI(`/api/claimed/${CJ?.ID}`, "DELETE", {}, true);
      if (call.status == 200) {
        Alert.alert("完成", "刪除成功");
        route.params.removeFromList(CJ?.ID);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  if (loading) {
    return (
      <SafeAreaView className="mx-4 px-1 my-2 flex justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="mx-4 px-1 my-2">
      <View>
        {CJ && (
          <>
            <Text className="my-2 text-xl dark:text-white">公司：{CJ.Cmpname}（{CJ.Cmpid}）</Text>
            <Text className="my-2 text-xl dark:text-white">駕駛：{CJ.Username}（{CJ.Userid}）</Text>
            <Text className="my-2 text-xl dark:text-white">
              工作資訊：{CJ.Fromloc} ➡ {CJ.Mid.Valid ? `${CJ.Mid.String} ➡ ` : ""} {CJ.Toloc}
            </Text>
            <Text className="my-2 text-xl dark:text-white">
              接取日期：{CJ.CreateDate.split("T")[0]} {CJ.CreateDate.split("T")[1].split(".")[0]}
            </Text>
            <Text className="my-2 text-xl dark:text-white">工作金額：{CJ.Price}</Text>

            <View className="my-2">
              <Text className="text-xl dark:text-white">完工照片：</Text>
              <UploadPicFCJob src={jobPic} />
            </View>

            {getUserInfo?.Role <= 200 && (

              <View className="flex flex-row justify-around">
                {!CJ.Approveddate.Valid && (
                  <Pressable
                    className="bg-cyan-200 dark:bg-cyan-400 rounded-xl w-1/3 py-3"
                    onPress={() => {
                      Alert.alert(
                        "注意",
                        `即將核可駕駛 ${CJ.Username} 之工作編號${CJ.ID}`,
                        [
                          {
                            text: "確定",
                            onPress: () => {
                              approveJobFun();
                            },
                          },
                          {
                            text: "我再想想",
                            onPress: () => { },
                          },
                        ]
                      );
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",

                        textAlignVertical: "center",
                      }}
                      className="text-lg"
                    >
                      核可
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  className="bg-red-200 dark:bg-red-400 rounded-xl w-1/3 py-3"
                  onPress={() => {
                    Alert.alert("注意", "確定要刪除此工作嗎？\n（希望你真的知道你在幹嘛", [
                      { text: "確定", onPress: deleteJobFun },
                      { text: "讓我再想想" },
                    ]);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",

                      textAlignVertical: "center",
                    }} className="text-lg">刪除</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ClaimJobP;
