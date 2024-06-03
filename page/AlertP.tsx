import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { alertT, newAlertT } from "../types/alertT";
import AlertBlock from "../components/AlertBlock";
import { FAB, TextInput } from "react-native-paper";
import GoodModal from "../components/GoodModal";
import { StyleSheet } from "nativewind";
import { cmpInfo } from "../types/userT";
import { useAtom } from "jotai";
import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme as usc } from "react-native";
import { userInfo } from "../App";

function AlertP(): React.JSX.Element {
  const cS = usc();

  const getData = useCallback(async () => {
    try {
      const res = await callAPI("/api/alert", "GET", {}, true);

      if (res.status == 200) setAlertList((await res.json()).res);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cmpList: cmpInfo[] = await (
          await callAPI("/api/cmp/all", "GET", {}, true)
        ).json();
        setCmpList(cmpList);
      } catch (error) {
        console.log(error);
      }
    };

    if (getUserInfo?.Role == 100) {
      fetchData();
    }

    getData();
  }, []);

  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);
  const [value, setValue] = useState();
  const [isFocus, setIsFocus] = useState(false);

  const [alertList, setAlertList] = useState<alertT[]>([]);
  const [newAlert, setNewAlert] = useState<newAlertT>();

  const handleSubmit = async () => {
    try {
      const res = await callAPI("/api/alert", "POST", newAlert!, true);

      if (res.status == 200) {
        Alert.alert("成功", "已新增通知", [{ text: "OK" }]);
        setValue(undefined);
        setNewAlert({});
        setVisible(false);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className="flex flex-col relative flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className=" relative ">
        <Text>{JSON.stringify(newAlert)}</Text>
        <FlatList
          className="h-full"
          data={alertList}
          renderItem={({ item }) => {
            if (!item.Deletedate.Valid) {
              return <AlertBlock alert={item} />;
            }
          }}
          keyExtractor={(item) => item.ID.toString()}
        />
        {getUserInfo?.Role == 100 ? (
          <FAB icon="plus" style={styles.fab} onPress={() => showModal()} />
        ) : (
          <></>
        )}
      </View>
      <GoodModal visible={visible} hideModal={hideModal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            className=" h-64 flex flex-col justify-between"
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={{
              display: "flex",
              paddingHorizontal: 10,
              backgroundColor: cS == "light" ? "#fff" : "#3A3B3C",
            }}
          >
            <View>
              <View className="flex flex-row w-full my-3 ">
                <Text
                  style={{ textAlignVertical: "center" }}
                  className="dark:text-white"
                >
                  通知內容
                </Text>
                <View className="mx-2 flex-1">
                  <TextInput
                    className="w-full"
                    onChangeText={(e) => {
                      setNewAlert({ ...newAlert!, alert: e });
                    }}
                  />
                </View>
              </View>
              <View className=" mt-4">
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
                  placeholder={!isFocus ? "請選擇" : "..."}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setNewAlert({ ...newAlert!, belongCmp: item.ID });
                    setIsFocus(false);
                  }}
                />
              </View>
            </View>
            <Pressable
              className="bg-blue-200 py-3 rounded-xl mb-3"
              onPress={async () => {
                await handleSubmit();
              }}
            >
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                送出
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </GoodModal>
    </SafeAreaView>
  );
}

export default AlertP;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
  container: {
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
