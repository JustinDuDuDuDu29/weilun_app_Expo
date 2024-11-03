// import { mode } from "d3";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
// import { styles } from "react-native-gifted-charts/src/LineChart/styles";
import { NullString, jobItemTS } from "../types/JobItemT";
import { useColorScheme as usc } from "react-native";
import { mode } from "d3";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { callAPI } from "../util/callAPIUtil";
import { cmpInfo } from "../types/userT";
import { useStore } from "jotai";
import { fnAtom } from "../App";
import { AlertMe } from "../util/AlertMe";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function CreateJobP(): React.JSX.Element {
  const store = useStore();
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  const getData = useCallback(async () => {
    try {
      const cmpList: cmpInfo[] = await (
        await callAPI("/api/cmp/all", "GET", {}, true)
      ).json();
      setCmpList(cmpList);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getData();
  }, []);

  const cS = usc();
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);

  const [jobItem, setJobItem] = useState<jobItemTS>({
    FromLoc: "",
    Mid: "",
    ToLoc: "",
    Price: 0,
    Remaining: 0,
    Belongcmp: NaN,
    Source: "",
    Jobdate: "",
    Memo: "",
  });

  //   const onChange = (
  //     event: DateTimePickerEvent,
  //     selectedDate: Date | undefined
  //   ) => {
  //     const currentDate = selectedDate;
  //     setShow(false);
  //     setJobItem({
  //       ...jobItem,
  //     });
  //   };
  //   const onChangeClose = (
  //     event: DateTimePickerEvent,
  //     selectedDate: Date | undefined
  //   ) => {
  //     const currentDate = selectedDate;
  //     setShowC(false);
  //     setJobItem({
  //       ...jobItem,
  //       CloseDate: currentDate!.toISOString().split("T")[0],
  //     });
  //   };
  const [value, setValue] = useState();
  const [isFocus, setIsFocus] = useState(false);
  //   const [visible, setVisible] = useState(false);
  //   const showModal = () => setVisible(true);
  //   const hideModal = () => setVisible(false);

  //   const [mode, setMode] = useState("date");

  //   const showMode = (currentMode: string) => {
  //     setShow(true);
  //     setMode(currentMode);
  //   };

  //   const showModeC = (currentMode: string) => {
  //     setShowC(true);
  //     setMode(currentMode);
  //   };

  //   const showDatepicker = () => {
  //     showMode("date");
  //   };
  //   const showDatepickerC = () => {
  //     showModeC("date");
  //   };
  const navigation = useNavigation<ScreenProp>();

  const updateJob = async () => {
    try {
      const res = await callAPI(
        "/api/jobs",
        "POST",
        {
          fromLoc: jobItem.FromLoc,
          mid: jobItem.Mid,
          toLoc: jobItem.ToLoc,
          price: jobItem.Price,
          estimated: jobItem.Remaining,
          belongCmp: jobItem.Belongcmp,
          source: jobItem.Source,
          memo: jobItem.Memo,
        },
        true
      );
      if (!res.ok) {
        throw res;
      }
      Alert.alert("成功", "資料新增成功", [{ text: "OK" }]);
      // await getData();
      // hideModal();
      setJobItem({
        FromLoc: "",
        Mid: "",
        ToLoc: "",
        Price: 0,
        Remaining: 0,
        Belongcmp: 0,
        Source: "",
        Jobdate: "",
        Memo: "",
      });

      navigation.goBack();
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
  };
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
              <View className="flex my-1 flex-row mt-2">
                <Text
                  className="text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  出發地:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    // value={jobItem.FromLoc}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, FromLoc: e });
                    }}
                  />
                </View>
              </View>
              <View className="flex my-1 flex-row mt-2">
                <Text
                  className="text-2xl  dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  經過:
                </Text>
                <View className="flex-1 py-3 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    // value={jobItem.Mid}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, Mid: e });
                    }}
                  />
                </View>
              </View>

              <View className="flex my-1 flex-row mt-2">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  終點:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    // value={jobItem.ToLoc}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, ToLoc: e });
                    }}
                  />
                </View>
              </View>

              <View className="flex my-1 flex-row mt-2">
                <Text
                  className="text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  業主:
                </Text>
                <View className="flex-1 py-3 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    // value={jobItem.Source}
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, Source: e });
                    }}
                  />
                </View>
              </View>

              <View className="flex flex-row my-2">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  注意事項:
                </Text>
                <View className="flex-1  px-2 mt-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    onChangeText={(e) => {
                      setJobItem({ ...jobItem, Memo: e });
                    }}
                  />
                </View>
              </View>
              <View className="flex my-2 flex-row mt-2">
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
                    // value={jobItem.Price?.toString()}
                    onChangeText={(e) => {
                      setJobItem({
                        ...jobItem,
                        Price: e == "" ? 0 : parseInt(e),
                      });
                    }}
                  />
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
                placeholder={
                  "..."
                  //   !isFocus
                  //     ? cmpList.find((el) => {
                  //         return el.ID == jobItem.Belongcmp;
                  //       })?.Name
                  //     : "..."
                }
                searchPlaceholder="Search..."
                value={value}
                // value={
                //   cmpList.find((el) => {
                //     return el.ID == jobItem.Belongcmp;
                //   })?.Name
                // }
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setJobItem({ ...jobItem, Belongcmp: item.ID });
                  setIsFocus(false);
                }}
              />

              <View className="flex my-1 flex-row mt-3">
                <Text
                  className=" text-2xl dark:text-white"
                  style={{ textAlignVertical: "center" }}
                >
                  剩餘趟數:
                </Text>
                <View className="flex-1  px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    keyboardType="numeric"
                    // value={jobItem.Remaining?.toString()}
                    onChangeText={(e) => {
                      setJobItem({
                        ...jobItem,
                        Remaining: e == "" ? 0 : parseInt(e),
                      });
                    }}
                  />
                </View>
              </View>

              <View className=" flex justify-around flex-row w-full mt-8">
                <Pressable
                  className=" w-1/3   bg-blue-200 py-2 rounded-xl"
                  onPress={async () => {
                    await updateJob();
                  }}
                >
                  <Text
                    className="text-2xl"
                    style={{
                      textAlignVertical: "center",
                      textAlign: "center",
                    }}
                  >
                    儲存
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default CreateJobP;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    paddingHorizontal: 10,
    // backgroundColor: usc() == "light" ? "#fff" : "#000",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 40,
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
