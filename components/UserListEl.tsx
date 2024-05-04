import React, { useState } from "react";
import { Pressable, SafeAreaView, View, Text } from "react-native";
import { inUserT } from "../types/userT";

function UseListEl({ info }: { info: inUserT }): React.JSX.Element {
  return (
    <SafeAreaView>
      <Pressable
        className={`my-1 rounded-lg px-4 py-2 ${
          info.DeletedDate.Valid
            ? "bg-red-400"
            : info.Role == 100
            ? "bg-indigo-300"
            : info?.Role == 200
            ? "bg-pink-300"
            : "bg-lime-200"
        }`}
        onPress={() => {}}
      >
        <View className="">
          <Text>員編：{info.ID}</Text>
          <Text>{info.Username}</Text>
          <Text>所屬公司：{info.Cmpname}</Text>
          <Text>
            職位：
            {info.Role == 100
              ? "管理員"
              : info?.Role == 200
              ? "公司負責人"
              : "司機"}
          </Text>
          <Text>{info.Phonenum}</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default UseListEl;
