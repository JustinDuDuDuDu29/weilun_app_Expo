import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  SafeAreaView,
  Text,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { useColorScheme as usc } from "react-native";

import { NullString, jobItemT, jobItemTS } from "../types/JobItemT";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StyleSheet } from "nativewind";
import { Dropdown } from "react-native-element-dropdown";
import { NullDate, cmpInfo } from "../types/userT";
import { callAPI } from "../util/callAPIUtil";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScreenProp } from "../types/navigationT";
import { useStore } from "jotai";
import { fnAtom } from "../App";
import { AlertMe } from "../util/AlertMe";
// import {} from "react-native-paper";

// import {TextInput} from "react-native-paper";

function JobUpdateP({
  route,
}: {
  route: RouteProp<{ params: { jobItem: jobItemT } }, "params">;
}): React.JSX.Element {
  const store = useStore();
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await callAPI("/api/cmp/all", "GET", {}, true);
        if (!res.ok) {
          throw res;
        }
        const cmpList: cmpInfo[] = await res.json();
        setCmpList(cmpList);
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
          Alert.alert("GG", `怪怪\n${err}`, [
            { text: "OK", onPress: () => {} },
          ]);
        }
      }
    };
    getData();
  }, []);
  const cS = usc();

  const [jobItem, setJobItem] = useState<jobItemTS>();
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  const [editable, setEditable] = useState(false);

  const [value, setValue] = useState(route.params.jobItem.Belongcmp);
  const [isFocus, setIsFocus] = useState(false);

  const updateJob = async () => {
    try {
      const res = await callAPI(
        "/api/jobs",
        "PUT",
        {
          ...route.params.jobItem,
          Mid: route.params.jobItem.Mid.String,

          ...jobItem,
          id: route.params.jobItem.ID,
        },
        true
      );
      if (res.status == 200)
        Alert.alert("成功", "資料修改成功", [{ text: "OK" }]);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{
          backgroundColor: cS == "light" ? "#fff" : "#3A3B3C",
        }}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={{
            display: "flex",
            paddingHorizontal: 10,
            backgroundColor: cS == "light" ? "#fff" : "#3A3B3C",
          }}
        >
          <ScrollView>
            <View className="mx-4 my-2 ">
              <Pressable
                className="bg-blue-200 w-full rounded-lg py-2 my-2"
                onPress={() => {
                  if (editable) {
                    navigation.goBack();
                  }
                  setEditable(!editable);
                }}
              >
                <Text
                  className=" text-2xl "
                  style={{ textAlign: "center", textAlignVertical: "center" }}
                >
                  {editable ? "取消" : "編輯"}
                </Text>
              </Pressable>
              <View className="flex my-1 flex-row mt-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  出發地:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    editable={editable}
                    // value={jobItem.FromLoc}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, FromLoc: e });
                    }}
                  >
                    <Text>{route.params.jobItem.FromLoc}</Text>
                  </TextInput>
                </View>
              </View>
              <View className="flex my-1 flex-row mt-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  經過:
                </Text>
                <View className="flex-1 py-3 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    editable={editable}
                    // value={
                    //   jobItem.Mid instanceof String
                    //     ? (jobItem.Mid as string)
                    //     : ((jobItem.Mid as NullString).String as string)
                    // }
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, Mid: e });
                    }}
                  >
                    <Text>{route.params.jobItem.Mid.String}</Text>
                  </TextInput>
                </View>
              </View>

              <View className="flex my-1 flex-row mt-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  終點:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    editable={editable}
                    // value={jobItem.ToLoc}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, ToLoc: e });
                    }}
                  >
                    <Text>{route.params.jobItem.ToLoc}</Text>
                  </TextInput>
                </View>
              </View>

              <View className="flex my-1 flex-row mt-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  業主:
                </Text>
                <View className="flex-1 py-3 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    editable={editable}
                    // value={jobItem.Source}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, Source: e });
                    }}
                  >
                    <Text>{route.params.jobItem.Source}</Text>
                  </TextInput>
                </View>
              </View>

              <View className="flex my-1 flex-row mt-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  注意事項:
                </Text>
                <View className="flex-1  px-2 my-3">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    editable={editable}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, Memo: e });
                    }}
                  >
                    <Text>{route.params.jobItem.Memo.String}</Text>
                  </TextInput>
                </View>
              </View>
              <View className="flex my-1 flex-row my-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  價格:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    keyboardType="numeric"
                    editable={editable}
                    onChangeText={(e) => {
                      setJobItem({
                        ...jobItem,
                        Price: e == "" ? 0 : parseInt(e),
                      });
                    }}
                  >
                    <Text>{route.params.jobItem.Price}</Text>
                  </TextInput>
                </View>
              </View>

              {/* <View className="flex flex-row w-full bg-blue-300"> */}
              <Text
                style={{ textAlignVertical: "center" }}
                className=" text-2xl dark:text-white"
              >
                所屬公司:
              </Text>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                mode="modal"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={cmpList}
                search
                labelField="Name"
                valueField="ID"
                disable={!editable}
                placeholder={
                  !isFocus
                    ? cmpList.find((el) => {
                        return el.ID == route.params.jobItem.Belongcmp;
                      })?.Name
                    : "..."
                }
                searchPlaceholder="Search..."
                value={
                  cmpList.find((el) => {
                    return el.ID == route.params.jobItem.Belongcmp;
                  })?.Name
                }
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setJobItem({ ...jobItem, Belongcmp: item.ID });
                  setIsFocus(false);
                }}
              />

              <View className="flex my-4 flex-row">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  剩餘趟數:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    editable={editable}
                    // value={jobItem.Remaining?.toString()}
                    onChangeText={(e) => {
                      setJobItem({
                        ...jobItem,
                        Remaining: e == "" ? 0 : parseInt(e),
                      });
                    }}
                  >
                    <Text>{route.params.jobItem.Remaining}</Text>
                  </TextInput>
                </View>
              </View>

              {editable && (
                <View className=" flex justify-around flex-row w-full mt-8">
                  <Pressable
                    className=" w-1/3   bg-blue-200 py-2 rounded-xl"
                    onPress={async () => {
                      await updateJob();
                    }}
                  >
                    <Text
                      className=" text-2xl"
                      style={{
                        textAlignVertical: "center",
                        textAlign: "center",
                      }}
                    >
                      儲存
                    </Text>
                  </Pressable>
                  <Pressable className=" w-1/3  bg-red-500 py-2 rounded-xl">
                    <Text
                      className=" text-2xl dark:text-white"
                      style={{
                        textAlignVertical: "center",
                        textAlign: "center",
                      }}
                    >
                      刪除
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default JobUpdateP;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  dropdown: {
    backgroundColor: "rgb(233, 223, 235)",
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
