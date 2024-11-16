import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View, Text, Dimensions } from "react-native";
import { ClaimedJob } from "../types/JobItemT";
import { Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function CJBlock({
  CJ,
  removeFromList,
}: {
  CJ: ClaimedJob;
  removeFromList: Function;
}): React.JSX.Element {
  useEffect(() => {}, [CJ]);

  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;

  return (
    <SafeAreaView>
      <Pressable
        className={`${
          CJ.Approveddate?.Valid
            ? "bg-slate-300"
            : CJ.Finishdate?.Valid
            ? "bg-yellow-300"
            : "bg-lime-200"
        } my-3 py-2 pb-4 rounded-2xl w-full`}
        onPress={() => {
          navigation.navigate("claimJobP", {
            claimedJob: CJ.ID,
            removeFromList: removeFromList,
          });
        }}
      >
        <View className="  flex flex-row justify-center content-center">
          <View
            style={{ flex: 0.3, flexBasis: 0.3 }}
            className="flex justify-center content-center"
          >
            <Text style={{ textAlign: "center" }} className="text-3xl">
              {CJ.Fromloc}
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
              {CJ.Mid?.String}
            </Text>
            <Icon source="arrow-right-bold" size={ww * 0.25} />
          </View>
          <View
            style={{ flex: 0.3, flexBasis: 0.3 }}
            className="flex justify-center content-center"
          >
            <Text style={{ textAlign: "center" }} className="text-3xl">
              {CJ.Toloc}
            </Text>
          </View>
        </View>
        <View className="flex flex-col">
          <View className="flex flex-row justify-around">
            <Text>作業編號：{CJ.ID}</Text>
            <Text>工作編號：{CJ.Jobid}</Text>
          </View>

          <View className="flex flex-row justify-around">
            <Text>工作編號：{CJ.Username}</Text>
            <Text>
              日期：
              {CJ.CreateDate.split("T")[0] +
                " " +
                CJ.CreateDate.split("T")[1].split(".")[0]}
            </Text>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default CJBlock;
