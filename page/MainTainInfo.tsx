import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

function MaintainInfo({
  route,
}: {
  route: RouteProp<{ params: { maintainID: number } }, "params">;
}): React.JSX.Element {
  return (
    <SafeAreaView>
      <View>
        <Text>{route.params.maintainID}</Text>
      </View>
    </SafeAreaView>
  );
}

export default MaintainInfo;
