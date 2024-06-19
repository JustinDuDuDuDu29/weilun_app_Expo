import React, { useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { alertT } from "../types/alertT";

function AlertBlock({ alert }: { alert: alertT }): React.JSX.Element {
  return (
    <SafeAreaView>
      <Pressable className="my-1 mx-2 px-6 bg-blue-200 py-2 rounded-xl">
        <View className="flex flex-row">
          <Text
            style={{ textAlign: "center", textAlignVertical: "center" }}
            className=" text-2xl"
          >
            {alert.Alert}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex flex-row">
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-lg"
            >
              關係公司:
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-lg"
            >
              {alert.Cmpname}
            </Text>
          </View>

          <View className="flex flex-row">
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-lg"
            >
              通知日期:
            </Text>
            <Text
              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-lg"
            >
              {alert.Createdate.split("T")[0] +
                " " +
                alert.Createdate.split("T")[1]}
            </Text>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default AlertBlock;
