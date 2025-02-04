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
import { useColorScheme as usc } from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { cmpInfo } from "../types/userT";
import { useAtom, useStore } from "jotai";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function CreateJobP(): React.JSX.Element {
  const store = useStore();
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);
  const [getUserInfo, setUserInfo] = useAtom(userInfo);

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

  const [jobItem, setJobItem] = useState({
    Fromloc: "",
    Mid: "",
    Toloc: "",
    Price: 0,
    Remaining: 0,
    Belongcmp: getUserInfo?.Role <= 100 ? NaN : getUserInfo?.Belongcmp,
    Source: "",
    Jobdate: "",
    Memo: "",
  });

  const [value, setValue] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation<ScreenProp>();

  const updateJob = async () => {
    try {
      const res = await callAPI(
        "/api/jobs",
        "POST",
        {
          fromLoc: jobItem.Fromloc,
          mid: jobItem.Mid,
          toLoc: jobItem.Toloc,
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
      setJobItem({
        Fromloc: "",
        Mid: "",
        Toloc: "",
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
        if (err.message === "Network request failed") {
          Alert.alert("糟糕！", "請檢查網路有沒有開", [{ text: "OK" }]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK" }]);
      }
    }
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{
          backgroundColor: cS === "light" ? "#fff" : "#3A3B3C",
        }}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={{
            display: "flex",
            paddingHorizontal: 10,
            backgroundColor: cS === "light" ? "#fff" : "#3A3B3C",
          }}
        >
          <ScrollView>
            {/* <Text allowFontScaling={false}>{JSON.stringify(jobItem)}</Text> */}
            <View className="mx-4 my-2">
              <View className="flex my-1 flex-row mt-2">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">出發地:</Text>
                <View className="flex-1 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    onChangeText={(e) => setJobItem({ ...jobItem, Fromloc: e })}
                  />
                </View>
              </View>
              <View className="flex my-1 flex-row mt-2">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">經過:</Text>
                <View className="flex-1 py-3 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    onChangeText={(e) => setJobItem({ ...jobItem, Mid: e })}
                  />
                </View>
              </View>
              <View className="flex my-1 flex-row mt-2">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">終點:</Text>
                <View className="flex-1 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    onChangeText={(e) => setJobItem({ ...jobItem, Toloc: e })}
                  />
                </View>
              </View>
              <View className="flex my-1 flex-row mt-2">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">業主:</Text>
                <View className="flex-1 py-3 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    onChangeText={(e) => setJobItem({ ...jobItem, Source: e })}
                  />
                </View>
              </View>
              <View className="flex flex-row my-2">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">注意事項:</Text>
                <View className="flex-1 px-2 mt-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    onChangeText={(e) => setJobItem({ ...jobItem, Memo: e })}
                  />
                </View>
              </View>
              <View className="flex my-2 flex-row mt-2">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">價格:</Text>
                <View className="flex-1 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    keyboardType="numeric"
                    onChangeText={(e) =>
                      setJobItem({ ...jobItem, Price: e === "" ? 0 : parseInt(e) })
                    }
                  />
                </View>
              </View>
              {getUserInfo?.Role <= 100 ? (
                <View className="flex my-2  mt-2">
                  <Text allowFontScaling={false}className="text-2xl dark:text-white">所屬公司:</Text>
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
                    placeholder={<Text allowFontScaling={false}>...</Text>}
                    searchPlaceholder="Search..."
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) =>
                      setJobItem({ ...jobItem, Belongcmp: item.ID })
                    }
                  />
                </View>
              ) : (
                <View className="flex my-2 flex-row mt-2">
                  <Text allowFontScaling={false}className="text-2xl dark:text-white">所屬公司:</Text>
                  <Text allowFontScaling={false}className="text-2xl border-b border-violet-200 dark:text-white">
                    {getUserInfo?.Cmpname ?? ""}
                  </Text>
                </View>
              )}
              <View className="flex my-1 flex-row mt-3">
                <Text allowFontScaling={false}className="text-2xl dark:text-white">剩餘趟數:</Text>
                <View className="flex-1 px-2">
                  <TextInput
                    className="text-2xl border-b border-violet-200 dark:text-white"
                    keyboardType="numeric"
                    onChangeText={(e) =>
                      setJobItem({ ...jobItem, Remaining: e === "" ? 0 : parseInt(e) })
                    }
                  />
                </View>
              </View>
              <View className="flex justify-around flex-row w-full mt-8">
                <Pressable
                  className="w-1/3 bg-blue-200 py-2 rounded-xl"
                  onPress={async () => {
                    await updateJob();
                  }}
                >
                  <Text allowFontScaling={false}className="text-center dark:text-black">新增</Text>
                </Pressable>
                <Pressable
                  className="w-1/3 bg-gray-200 py-2 rounded-xl"
                  onPress={() => navigation.goBack()}
                >
                  <Text allowFontScaling={false}className="text-center dark:text-black">返回</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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

export default CreateJobP;
