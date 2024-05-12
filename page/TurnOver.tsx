import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

function TurnOver(): React.JSX.Element {
  const navigation = useNavigation();
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
  return <SafeAreaView></SafeAreaView>;
}

export default TurnOver;
