import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
  Text,
  useColorScheme as usc,
  StyleSheet,
} from "react-native";
import { NewUser, cmpInfo, inUserT } from "../types/userT";
import { Dropdown } from "react-native-element-dropdown";
import { RadioButton } from "react-native-paper";
import { callAPI } from "../util/callAPIUtil";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "jotai";
import { fnAtom } from "../App";
import { AlertMe } from "../util/AlertMe";

function EditUserInfoP({
  route,
}: {
  route: RouteProp<{ params: { OInfo: inUserT } }, "params">;
}): React.JSX.Element {
  const store = useStore();
  const cS = usc();
  const [canPress, setCanPress] = useState<boolean>(false);

  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [newUserType, setNewUserType] = useState(
    route.params.OInfo?.Role == 200 ? "cmpAdmin" : "driver"
  );
  const [user, setUser] = useState<NewUser>({
    Name: route.params.OInfo?.Username,
    Role: newUserType,
    PhoneNum: route.params.OInfo?.Phonenum,
    BelongCmp: route.params.OInfo?.Belongcmp,
    driverInfo: {
      // percentage: route.params.OInfo?.Percentage?.Int32,
      nationalIdNumber: route.params.OInfo?.Nationalidnumber,
      plateNum: route.params.OInfo?.Platenum?.String,
    },
  });
  const roleName =
    route.params.OInfo?.Role == 100
      ? "管理員"
      : route.params.OInfo?.Role == 200
      ? "公司負責人"
      : "司機";

  const getCmp = useCallback(async () => {
    const cmpList: cmpInfo[] = await (
      await callAPI("/api/cmp/all", "GET", {}, true)
    ).json();
    setCmpList(cmpList);
  }, []);

  useEffect(() => {
    getCmp();
  }, []);
  const navigation = useNavigation<ScreenProp>();
  const insets = useSafeAreaInsets();
  const submitFun = async () => {
    setCanPress(true);
    try {
      const res = await callAPI(
        `/api/user/${route.params.OInfo.ID}`,
        "PUT",
        user,
        true
      );
      if (!res.ok) throw res;

      Alert.alert("完成", "成功修改資料", [
        {
          text: "OK",
          onPress: () => {
            console.log("POPO");
            navigation.pop(2);
          },
        },
      ]);
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
    } finally {
      setCanPress(false);
    }
  };
  return (
    <SafeAreaView
      className="flex flex-col relative flex-1 mx-4 my-3"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="my-3 flex flex-row">
        <Text
          className="text-xl dark:text-white"
          style={{ textAlign: "center", textAlignVertical: "center" }}
        >
          姓名：
        </Text>
        <TextInput
          className={`flex-1 text-xl px-3 color-black rounded-xl border-b-2  border-fuchsia-300 dark:text-white`}
          placeholder="姓名"
          onChangeText={(e) => {
            setUser({ ...user, Name: e });
          }}
        >
          {route.params.OInfo?.Username}
        </TextInput>
      </View>
      <View className="my-3 flex flex-row">
        <Text
          className="text-xl dark:text-white"
          style={{ textAlign: "center", textAlignVertical: "center" }}
        >
          手機號碼：
        </Text>
        <TextInput
          className={`flex-1 text-xl px-3 color-black rounded-xl  border-b-2  border-fuchsia-300 dark:text-white`}
          keyboardType="numeric"
          placeholderTextColor={cS == "light" ? "black" : "#ffffff"}
          placeholder="電話號碼"
          onChangeText={(e) => {
            setUser({ ...user, PhoneNum: e });
          }}
        >
          {route.params.OInfo?.Phonenum}
        </TextInput>
      </View>

      <View className="my-3 flex flex-row">
        <Text
          className="text-xl dark:text-white"
          style={{ textAlign: "center", textAlignVertical: "center" }}
        >
          所屬公司：
        </Text>
        <View className="flex-1">
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
            placeholder={!isFocus ? "所屬公司" : "..."}
            searchPlaceholder="Search..."
            value={route.params.OInfo?.Belongcmp}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setUser({ ...user, BelongCmp: item.ID });
              setIsFocus(false);
            }}
          />
        </View>
      </View>

      {!(route.params.OInfo?.Role == 100) ? (
        <RadioButton.Group
          onValueChange={(newValue) => {
            setNewUserType(newValue);

            setUser({
              Name: user.Name,
              BelongCmp: user.BelongCmp,
              Role: newUserType,
              PhoneNum: user.PhoneNum,
              driverInfo: {
                plateNum: route.params.OInfo?.Platenum?.String,
                nationalIdNumber: route.params.OInfo?.Nationalidnumber,
                // percentage: route.params.OInfo?.Percentage?.Int32,
              },
            });
          }}
          value={newUserType}
        >
          <View className="my-3 flex flex-row">
            <Text
              className=" dark:text-white text-xl"
              style={{ textAlignVertical: "center", textAlign: "center" }}
            >
              職位：
            </Text>
            <View className="flex-1 flex flex-row  items-center align-middle">
              {/* <View className=" border my-3 rounded-full"> */}
              <RadioButton value="driver" />
              {/* </View> */}
              <Text allowFontScaling={false}className=" dark:text-white">司機</Text>
            </View>
            <View className="flex-1 flex flex-row  items-center align-middle">
              {/* <View className=" border my-3 rounded-full"> */}
              <RadioButton value="cmpAdmin" />
              {/* </View> */}
              <Text allowFontScaling={false}className=" dark:text-white">公司負責人</Text>
            </View>
          </View>
        </RadioButton.Group>
      ) : (
        <View className="my-3 flex flex-row">
          <Text
            className="text-xl dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            職位：
          </Text>
          <Text
            className=" text-xl px-3 color-black rounded-xl dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            {roleName}
          </Text>
        </View>
      )}
      {newUserType === "driver" ? (
        <>
          <View className="my-3 flex flex-row">
            <Text
              className="text-xl dark:text-white"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              身份證：
            </Text>
            <TextInput
              className={`flex-1 text-xl px-3 color-black rounded-xl border-b-2  border-fuchsia-300 dark:text-white`}
              placeholder="身份證"
              onChangeText={(e) => {
                setUser({
                  ...user,
                  driverInfo: {
                    // percentage: user.driverInfo?.percentage!,
                    plateNum: user.driverInfo?.plateNum,
                    nationalIdNumber: e,
                  },
                });
              }}
            >
              {route.params.OInfo?.Nationalidnumber}
            </TextInput>
          </View>
          <View className="my-3 flex flex-row">
            <Text
              className="text-xl dark:text-white"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              車牌號碼：
            </Text>
            <TextInput
              className={`flex-1 text-xl px-3 color-black rounded-xl border-b-2  border-fuchsia-300 dark:text-white`}
              placeholder="車牌號碼"
              onChangeText={(e) => {
                setUser({
                  ...user,
                  driverInfo: {
                    // percentage: user.driverInfo?.percentage!,
                    plateNum: e,
                    nationalIdNumber: user.driverInfo?.nationalIdNumber!,
                  },
                });
              }}
            >
              {route.params.OInfo.Platenum?.String}
            </TextInput>
          </View>
          {/* <View className="my-3 flex flex-row">
            <Text
              className="text-xl dark:text-white"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              比率：
            </Text>
            <TextInput
              className={`flex-1 text-xl px-3 color-black rounded-xl border-b-2  border-fuchsia-300 dark:text-white`}
              placeholder="比率"
              keyboardType="numeric"
              onChangeText={(e) => {
                setUser({
                  ...user,
                  driverInfo: {
                    // ...user.driverInfo,
                    nationalIdNumber: user.driverInfo?.nationalIdNumber!,
                    plateNum: user.driverInfo?.plateNum!,
                    // percentage: parseInt(e),
                  },
                });
              }}
            >
              {route.params.OInfo?.Percentage?.Int32}
            </TextInput>
          </View> */}
        </>
      ) : (
        <></>
      )}
      <View className="flex flex-row justify-center">
        <Pressable
          className="border w-1/3 rounded-lg bg-violet-300 px-3 py-2"
          onPress={submitFun}
          disabled={canPress}
        >
          <Text
            style={{ verticalAlign: "middle", textAlign: "center" }}
            className="dark:text-white"
          >
            送出
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default EditUserInfoP;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
  container: {
    display: "flex",
    paddingHorizontal: 10,
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
