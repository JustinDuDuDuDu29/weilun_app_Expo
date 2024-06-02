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
import { useAtom } from "jotai";
import { userInfo } from "./Home";

function Maintain(): React.JSX.Element {
  const cS = usc();
  const [jobInfo, setJobInfo] = useState();
  const getData = useCallback(async () => {
    try {
      const res = await callAPI(`/api/repair/cj?cat=pending`, "GET", {}, true);
      if (res.status == 200) {
        console.log(await res.json());
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  return (
    <SafeAreaView>
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
