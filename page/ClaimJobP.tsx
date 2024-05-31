import React, { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";
import { CJInfo, ClaimedJob, NullString } from "../types/JobItemT";
import { ImgT, imgUrl } from "../types/ImgT";
import { GIBEDEIMGB0SS, callAPI } from "../util/callAPIUtil";
import { RouteProp, useNavigation } from "@react-navigation/native";
import UploadPic from "../components/UploadPicFCJob";
import { ScreenProp } from "../types/navigationT";
import { useAtom } from "jotai";
import { userInfo } from "./Home";
import UploadPicFCJob from "../components/UploadPicFCJob";

function ClaimJobP({
  route,
}: {
  route: RouteProp<{ params: { claimedJob: number } }, "params">;
}): React.JSX.Element {
  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();
  const [jobPic, setJobPic] = useState<imgUrl | null>(null);
  const [CJ, setCJ] = useState<CJInfo>();
  const getData = useCallback(async () => {
    try {
      const res = await callAPI(
        // `/api/claimed/${route.params.claimedJob}`,
        `/api/claimed?cjID=${route.params.claimedJob}`,
        "GET",
        {},
        true
      );

      if (res.status == 200) {
        const data: CJInfo[] = await res.json();
        console.log("DATA: ", data[0]);
        if (data[0].Finishpic.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${data[0].Finishpic.String}`
          );
          setJobPic(src);
        }
        setCJ(data[0]);
      }
    } catch (error) {}
  }, []);

  const deleteJobFun = async () => {
    try {
      const call = await callAPI(`/api/claimed/${CJ?.ID}`, "DELETE", {}, true);
      if (call.status == 200) {
        Alert.alert("完成", "刪除成功");
        navigation.navigate("adminClaimedJobP");
      }
    } catch (error) {}
  };

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
      }
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView className="mx-4 px-1 my-2">
      <View>
        <View>
          <Text>sdf:{JSON.stringify(CJ)}</Text>

          <Text className="my-2 text-xl dark:text-white">
            公司： {CJ?.Cmpname}（{CJ?.Cmpid}）
          </Text>
          <Text className="my-2 text-xl dark:text-white">
            駕駛： {CJ?.Username}（{CJ?.Userid}）
          </Text>
          <Text className="my-2 text-xl dark:text-white">
            工作資訊： {CJ?.FromLoc} ➡{" "}
            {CJ?.Mid.Valid ? `${CJ?.Mid.String} ➡ ` : ""}
            {CJ?.ToLoc}
          </Text>
          <Text className="my-2 text-xl dark:text-white">
            接取日期： {CJ?.CreateDate.split("T")[0]}
          </Text>
          <Text className="my-2 text-xl dark:text-white">
            工作金額： {CJ?.Price}
          </Text>
          {/* {CJ?.Approveddate.Valid ? (
            <>
              <Text className="my-2 text-xl dark:text-white">
                核可時比率：{CJ.Percentage.Int32}
              </Text>
              <Text className="my-2 text-xl dark:text-white">
                駕駛賺取金額：{(CJ.Percentage.Int32 / 100) * CJ.Price}
              </Text>
            </>
          ) : (
            <></>
          )} */}

          <View className="my-2">
            <Text className="text-xl dark:text-white">完工照片：</Text>
            <UploadPicFCJob src={jobPic} />
          </View>
        </View>
        {getUserInfo?.Role === 100 ? (
          <View className="flex flex-row justify-around">
            {CJ?.Approveddate.Valid ? (
              <></>
            ) : (
              <Pressable
                className="bg-cyan-200 dark:bg-cyan-400 rounded-xl px-20 py-3 "
                onPress={() => {
                  Alert.alert(
                    "注意",
                    `即將核可駕駛 ${CJ?.Username} 之工作編號${CJ?.ID}`,
                    [
                      {
                        text: "確定",
                        onPress: () => {
                          approveJobFun();
                        },
                      },
                      {
                        text: "我再想想",
                        onPress: () => {},
                      },
                    ]
                  );
                }}
              >
                <Text className="text-lg">核可</Text>
              </Pressable>
            )}
            <Pressable
              className="bg-red-200 dark:bg-red-400 rounded-xl px-20 py-3 "
              onPress={() => {
                Alert.alert(
                  "注意",
                  "確定要刪除此工作嗎？\n（希望你真的知道你在幹嘛",
                  [
                    {
                      text: "確定",
                      onPress: () => {
                        deleteJobFun();
                      },
                    },
                    { text: "讓我再想想" },
                  ]
                );
              }}
            >
              <Text className="text-lg">刪除</Text>
            </Pressable>
          </View>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ClaimJobP;
