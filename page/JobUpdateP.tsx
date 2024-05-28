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
} from "react-native";
import { NullString, jobItemT } from "../types/JobItemT";
import { RouteProp } from "@react-navigation/native";
import { StyleSheet } from "nativewind";
import { Dropdown } from "react-native-element-dropdown";
import { NullDate, cmpInfo } from "../types/userT";
import { callAPI } from "../util/callAPIUtil";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";

// import {TextInput} from "react-native-paper";

function JobUpdateP({
  route,
}: {
  route: RouteProp<{ params: { jobItem: jobItemT } }, "params">;
}): React.JSX.Element {
  useEffect(() => {
    const getData = async () => {
      try {
        const cmpList: cmpInfo[] = await (
          await callAPI("/api/cmp/all", "GET", {}, true)
        ).json();
        setCmpList(cmpList);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const [jobItem, setJobItem] = useState(route.params.jobItem);
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  const [editable, setEditable] = useState(false);

  const [value, setValue] = useState(jobItem.Belongcmp);
  const [isFocus, setIsFocus] = useState(false);

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);

  const onChange = (event, selectedDate: Date) => {
    const currentDate = selectedDate;
    setShow(false);
    setJobItem({ ...jobItem, Jobdate: currentDate.toISOString() });
  };
  const onChangeClose = (event, selectedDate: Date) => {
    const currentDate = selectedDate;
    setShowC(false);
    setJobItem({ ...jobItem, CloseDate: currentDate.toISOString() });
  };

  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };

  const showModeC = (currentMode: string) => {
    setShowC(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };
  const showDatepickerC = () => {
    showModeC("date");
  };

  const updateJob = async () => {
    try {
      const res = await callAPI(
        "/api/jobs",
        "PUT",
        {
          fromLoc: jobItem.FromLoc,
          mid:
            jobItem.Mid instanceof String
              ? jobItem.Mid
              : (jobItem.Mid as NullString).String,
          toLoc: jobItem.ToLoc,
          price: jobItem.Price,
          remaining: jobItem.Remaining,
          belongCmp: jobItem.Belongcmp,
          source: jobItem.Source,
          jobDate: jobItem.Jobdate.split("T")[0],
          memo:
            jobItem.Memo instanceof String
              ? jobItem.Memo
              : (jobItem.Memo as NullString).String,
          closeDate:
            typeof jobItem.CloseDate === "string"
              ? (jobItem.CloseDate as string).split("T")[0]
              : (jobItem.CloseDate as NullDate).Valid
              ? (jobItem.CloseDate as NullDate).Time.split("T")[0]
              : "",
          id: jobItem.ID,
        },
        true
      );
      if (res.status == 200)
        Alert.alert("成功", "資料修改成功", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      >
        <ScrollView>
          <View className="mx-4 my-2 ">
            <Pressable
              className="bg-blue-200 w-full rounded-lg py-2 my-2"
              onPress={() => {
                if (editable) {
                  setJobItem(route.params.jobItem);
                  setValue(route.params.jobItem.Belongcmp);
                }
                setEditable(!editable);
              }}
            >
              <Text
                className=" text-2xl"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                {editable ? "取消" : "編輯"}
              </Text>
            </Pressable>
            <View className="flex my-1 flex-row">
              <Text
                className="text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                出發地:
              </Text>
              <View className="flex-1  px-2">
                <TextInput
                  className="text-2xl"
                  editable={editable}
                  value={jobItem.FromLoc}
                  onChangeText={(e) => {
                    setJobItem({ ...jobItem, FromLoc: e });
                  }}
                />
              </View>
            </View>
            <View className="flex my-1 flex-row">
              <Text
                className="text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                經過:
              </Text>
              <View className="flex-1 py-3 px-2">
                <TextInput
                  className="text-2xl "
                  editable={editable}
                  value={
                    jobItem.Mid instanceof String
                      ? (jobItem.Mid as string)
                      : ((jobItem.Mid as NullString).String as string)
                  }
                  onChangeText={(e) => {
                    setJobItem({ ...jobItem, Mid: e });
                  }}
                />
              </View>
            </View>

            <View className="flex my-1 flex-row">
              <Text
                className=" text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                終點:
              </Text>
              <View className="flex-1  px-2">
                <TextInput
                  editable={editable}
                  value={jobItem.ToLoc}
                  onChangeText={(e) => {
                    setJobItem({ ...jobItem, ToLoc: e });
                  }}
                />
              </View>
            </View>

            <View className="flex my-1 flex-row">
              <Text
                className="text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                甲方:
              </Text>
              <View className="flex-1 py-3 px-2">
                <TextInput
                  editable={editable}
                  value={jobItem.Source}
                  onChangeText={(e) => {
                    setJobItem({ ...jobItem, Source: e });
                  }}
                />
              </View>
            </View>

            <View className="flex my-1 flex-row">
              <Text
                className=" text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                注意事項:
              </Text>
              <View className="flex-1  px-2">
                <TextInput
                  editable={editable}
                  value={
                    jobItem.Memo instanceof String
                      ? (jobItem.Memo as string)
                      : ((jobItem.Memo as NullString).String as string)
                  }
                  onChangeText={(e) => {
                    setJobItem({ ...jobItem, Memo: e });
                  }}
                />
              </View>
            </View>
            <View className="flex my-1 flex-row">
              <Text
                className=" text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                價格:
              </Text>
              <View className="flex-1  px-2">
                <TextInput
                  editable={editable}
                  value={jobItem.Price?.toString()}
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
            <Text style={{ textAlignVertical: "center" }} className=" text-2xl">
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
                      return el.ID == jobItem.Belongcmp;
                    })?.Name
                  : "..."
              }
              searchPlaceholder="Search..."
              value={
                cmpList.find((el) => {
                  return el.ID == jobItem.Belongcmp;
                })?.Name
              }
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setJobItem({ ...jobItem, Belongcmp: item.ID });
                setIsFocus(false);
              }}
            />

            <View className="flex my-1 flex-row mt-2">
              <Text
                className=" text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                剩餘趟數:
              </Text>
              <View className="flex-1  px-2">
                <TextInput
                  editable={editable}
                  value={jobItem.Remaining?.toString()}
                  onChangeText={(e) => {
                    setJobItem({
                      ...jobItem,
                      Remaining: e == "" ? 0 : parseInt(e),
                    });
                  }}
                />
              </View>
            </View>
            <View className="flex my-1 flex-row">
              <Text
                className=" text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                工作開始日:
              </Text>
              <Text
                style={{ textAlignVertical: "center" }}
                className=" px-2 text-2xl"
                onPress={() => {
                  if (editable) {
                    showDatepicker();
                  }
                }}
              >
                {jobItem.Jobdate.split("T")[0]}
              </Text>

              {show && (
                <DateTimePicker
                  value={new Date(jobItem.Jobdate)}
                  mode={mode}
                  onChange={onChange}
                />
              )}
            </View>

            <View className="flex my-1 flex-row">
              <Text
                className=" text-2xl"
                style={{ textAlignVertical: "center" }}
              >
                工作結束日:
              </Text>
              <Text
                style={{ textAlignVertical: "center" }}
                className="flex-1 text-2xl px-2"
                onPress={() => {
                  if (editable) {
                    showDatepickerC();
                  }
                }}
              >
                {typeof jobItem.CloseDate === "string"
                  ? jobItem.CloseDate.split("T")[0]
                  : (jobItem.CloseDate as NullDate).Valid
                  ? (jobItem.CloseDate as NullDate).Time.split("T")[0]
                  : ""}
              </Text>
              {showC && (
                <DateTimePicker
                  value={
                    typeof jobItem.CloseDate === "string"
                      ? new Date(jobItem.CloseDate as string)
                      : new Date()
                  }
                  mode={mode}
                  onChange={onChangeClose}
                />
              )}
              {editable && (
                <Pressable
                  className=" bg-blue-200 px-2 rounded-lg py-1"
                  onPress={() => setJobItem({ ...jobItem, CloseDate: "" })}
                >
                  <Text
                    className=" text-lg"
                    style={{ textAlign: "center", textAlignVertical: "center" }}
                  >
                    清除
                  </Text>
                </Pressable>
              )}
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
                    className="text-2xl"
                    style={{ textAlignVertical: "center", textAlign: "center" }}
                  >
                    儲存
                  </Text>
                </Pressable>
                <Pressable className=" w-1/3  bg-red-500 py-2 rounded-xl">
                  <Text
                    className="text-2xl"
                    style={{ textAlignVertical: "center", textAlign: "center" }}
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
