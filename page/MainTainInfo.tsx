import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { GIBEDEIMGB0SS, callAPI } from "../util/callAPIUtil";
import UserCU from "../components/UserCU";
import { mInfoT, maintainInfoT } from "../types/maintainT";
import { useAtom, useStore } from "jotai";
import { ScreenProp } from "../types/navigationT";
import UploadPicFCJob from "../components/UploadPicFCJob";
import { imgUrl } from "../types/ImgT";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function MaintainInfo({
  route,
}: {
  route: RouteProp<{ params: { maintainID: number } }, "params">;
}): React.JSX.Element {
  const store = useStore();
  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const navigation = useNavigation<ScreenProp>();
  const [jobPic, setJobPic] = useState<imgUrl | null>(null);

  const [mInfo, setMInfo] = useState<maintainInfoT>();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const getData = useCallback(async () => {
    try {
      const res = await callAPI(
        `/api/repair?id=${route.params.maintainID}`,
        "GET",
        {},
        true
      );
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();

      setMInfo(data.res[0]);
      console.log(data.res[0].Pic.Valid);
      let calculatedTotalPrice = 0;
      data.res[0].Repairinfo.forEach((el) => {
        calculatedTotalPrice += el.price!;
      });
      setTotalPrice(calculatedTotalPrice);
      if (data.res[0].Pic.Valid) {
        const src = await GIBEDEIMGB0SS(
          `/api/static/img/${data.res[0].Pic.String}`
        );
        setJobPic(src);
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
      } else if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  }, [route.params.maintainID]);

  const approveRepairFun = async () => {
    try {
      const call = await callAPI(
        `/api/repair/approve/${mInfo?.ID}`,
        "POST",
        {},
        true
      );
      if (call.status == 200) {
        Alert.alert("完成", "核可資料成功");
        getData();
      }
    } catch (error) {
      console.error("Error approving job: ", error);
    }
  };
  const deleteRepairFun = async () => {
    try {
      const call = await callAPI(
        `/api/repair/${mInfo?.ID}`,
        "DELETE",
        {},
        true
      );
      if (call.status == 200) {
        Alert.alert("完成", "刪除成功");
        navigation.navigate("adminClaimedJobP");
      }
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const renderHeader = () => (
    <View>
      <Text className="dark:text-white text-xl">維修編號：{mInfo?.ID}</Text>
      <Text className="dark:text-white text-xl">姓名：{mInfo?.Drivername}</Text>
      <Text className="dark:text-white text-xl">
        車牌號碼：{mInfo?.Platenum}
      </Text>
      <Text className="dark:text-white text-xl">維修地點：{mInfo?.Place}</Text>
      <Text className="dark:text-white text-xl">
        所屬公司：{mInfo?.Cmpname}
      </Text>
      <Text className="dark:text-white text-xl">
        維修日期：{mInfo?.Createdate.split("T")[0]}
      </Text>
      <Text className="dark:text-white text-xl">詳細資訊：</Text>
      <View className="flex flex-row">
        <Text
          className="dark:text-white text-xl"
          style={{
            flex: 1 / 3,
            flexBasis: 1 / 3,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          品名
        </Text>
        <Text
          className="dark:text-white text-xl"
          style={{
            flex: 1 / 3,
            flexBasis: 1 / 3,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          數量
        </Text>
        <Text
          className="dark:text-white text-xl"
          style={{
            flex: 1 / 3,
            flexBasis: 1 / 3,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          總價
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View>
      <Text className="dark:text-white text-xl">維修總價:{totalPrice}</Text>
      <View className="my-2">
        <Text className="text-xl dark:text-white">照片：</Text>
        <UploadPicFCJob src={jobPic} />
      </View>
      {getUserInfo?.Role === 100 && (
        <View className="flex flex-row justify-around">
          {!mInfo?.Approveddate.Valid && (
            <Pressable
              className="bg-cyan-200 dark:bg-cyan-400 rounded-xl px-20 py-3"
              onPress={() => {
                Alert.alert(
                  "注意",
                  `即將核可駕駛 ${mInfo?.Drivername} 之維修`,
                  [
                    {
                      text: "確定",
                      onPress: () => {
                        approveRepairFun();
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
            className="bg-red-200 dark:bg-red-400 rounded-xl px-20 py-3"
            onPress={() => {
              Alert.alert(
                "注意",
                "確定要刪除此工作嗎？\n（希望你真的知道你在幹嘛",
                [
                  {
                    text: "確定",
                    onPress: () => {
                      deleteRepairFun();
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
      )}
    </View>
  );

  return (
    <SafeAreaView>
      <View className="px-5 py-3">
        <FlatList
          data={mInfo?.Repairinfo}
          renderItem={({ item }) => (
            <View className="flex flex-row">
              <Text
                className="dark:text-white text-xl"
                style={{
                  flex: 1 / 3,
                  flexBasis: 1 / 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                {item.name}
              </Text>
              <Text
                className="dark:text-white text-xl"
                style={{
                  flex: 1 / 3,
                  flexBasis: 1 / 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                {item.quantity}
              </Text>
              <Text
                className="dark:text-white text-xl"
                style={{
                  flex: 1 / 3,
                  flexBasis: 1 / 3,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                {item.price}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
}

export default MaintainInfo;
