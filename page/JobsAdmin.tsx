import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
  Text,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import _data from "../asset/fakeData/_jobs.json";
import { NullString, jobItemT } from "../types/JobItemT";
import JobBlock from "../components/JobBlock";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { callAPI } from "../util/callAPIUtil";
import { FAB, TextInput } from "react-native-paper";
import GoodModal from "../components/GoodModal";
import { StyleSheet } from "nativewind";
import { Dropdown } from "react-native-element-dropdown";
import { cmpInfo } from "../types/userT";

function JobsAdmin(): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cmpList: cmpInfo[] = await (
          await callAPI("/api/cmp/all", "GET", {}, true)
        ).json();
        setCmpList(cmpList);
        const allJobs = await (
          await callAPI("/api/jobs/all", "POST", {}, true)
        ).json();
        setData(allJobs);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getData = async () => {
    setRefreshing(true);
    await new Promise(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    });
  };

  //

  const [jobItem, setJobItem] = useState<jobItemT>({
    FromLoc: "",
    Mid: "",
    ToLoc: "",
    Price: undefined,
    Remaining: undefined,
    Belongcmp: NaN,
    Source: "",
    Jobdate: "",
    Memo: "",
    CloseDate: "",
    DeleteDate: "",
  });
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  const [value, setValue] = useState();
  const [isFocus, setIsFocus] = useState(false);

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShow(false);
    setJobItem({
      ...jobItem,
      Jobdate: currentDate.toISOString().split("T")[0],
    });
  };
  const onChangeClose = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShowC(false);
    setJobItem({
      ...jobItem,
      CloseDate: currentDate!.toISOString().split("T")[0],
    });
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
        "POST",
        {
          fromLoc: jobItem.FromLoc,
          mid: jobItem.Mid,
          toLoc: jobItem.ToLoc,
          price: jobItem.Price,
          estimated: jobItem.Remaining,
          belongCmp: jobItem.Belongcmp,
          source: jobItem.Source,
          jobDate: jobItem.Jobdate.split("T")[0],
          memo: jobItem.Memo,
          closeDate: jobItem.CloseDate,
        },
        true
      );
      if (res.status == 200)
        Alert.alert("成功", "資料新增成功", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
    }
  };
  //
  return (
    <SafeAreaView>
      <View className="mx-5 relative">
        <FlatList
          data={data}
          className="h-full"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getData()}
            />
          }
          renderItem={({ item }: { item: jobItemT }) => (
            <JobBlock jobItem={item} />
          )}
        />
        <FAB icon="plus" style={styles.fab} onPress={() => showModal()} />
      </View>
      <GoodModal visible={visible} hideModal={hideModal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={styles.container}
          >
            <ScrollView>
              <View className="mx-4 my-2 ">
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
                    土頭:
                  </Text>
                  <View className="flex-1 py-3 px-2">
                    <TextInput
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
                <Text
                  style={{ textAlignVertical: "center" }}
                  className=" text-2xl"
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

                  <View className="flex-1">
                    <TextInput
                      right={
                        <TextInput.Icon
                          icon={"calendar-blank"}
                          onPress={() => {
                            showDatepicker();
                          }}
                        />
                      }
                      onChangeText={(e) => {
                        setJobItem({ ...jobItem, Jobdate: e });
                      }}
                      value={jobItem.Jobdate as string}
                      style={{ textAlignVertical: "center" }}
                      className="flex-1 text-2xl px-2"
                    />
                  </View>
                  {show && (
                    <DateTimePicker
                      value={new Date()}
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
                  <View className="flex-1">
                    <TextInput
                      right={
                        <TextInput.Icon
                          icon={"calendar-blank"}
                          onPress={() => {
                            showDatepickerC();
                          }}
                        />
                      }
                      onChangeText={(e) => {
                        setJobItem({ ...jobItem, CloseDate: e });
                      }}
                      value={jobItem.CloseDate as string}
                      style={{ textAlignVertical: "center" }}
                      className="flex-1 text-2xl px-2"
                    />
                  </View>
                  {showC && (
                    <DateTimePicker
                      value={new Date()}
                      mode={mode}
                      onChange={onChangeClose}
                    />
                  )}
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
      </GoodModal>
    </SafeAreaView>
  );
}

export default JobsAdmin;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    paddingHorizontal: 10,
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
