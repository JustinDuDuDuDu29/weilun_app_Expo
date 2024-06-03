import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  Pressable,
  Alert,
  Text,
  useColorScheme as usc,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
} from "react-native";
import MaintainBlock from "../components/MaintainBlock";
import { mInfoT, maintainInfoT } from "../types/maintainT";
import { FAB, Icon } from "react-native-paper";
import { StyleSheet } from "nativewind";
import GoodModal from "../components/GoodModal";
import SmallModal from "../components/SmallModal";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { callAPI, callAPIForm } from "../util/callAPIUtil";
import { useAtom, useStore } from "jotai";
import { useIsFocused } from "@react-navigation/native";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function Maintain(): React.JSX.Element {
  const focused = useIsFocused();
  const store = useStore();
  const cS = usc();
  const [jobInfo, setJobInfo] = useState<maintainInfoT[]>();
  const getData = useCallback(async () => {
    try {
      const res = await callAPI(`/api/repair?cat=pending`, "GET", {}, true);
      if (res.status == 200) {
        setJobInfo((await res.json()).res);
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
  }, []);

  useEffect(() => {
    getData();
  }, [focused]);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  return (
    <SafeAreaView>
      <View className="py-4 px-3">
        <FlatList
          className="h-full"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={jobInfo}
          keyExtractor={(item) => {
            return item.ID!.toString();
          }}
          renderItem={({ item }: { item: maintainInfoT }) => (
            <MaintainBlock maintainInfo={item} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 40,
  },
});

export default Maintain;
