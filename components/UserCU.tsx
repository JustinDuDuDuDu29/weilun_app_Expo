import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { NewUser, cmpInfo, inUserT } from "../types/userT";

import { StyleSheet } from "nativewind";
import { Icon, RadioButton } from "react-native-paper";
import DriverPic from "./DriverPic";
import { callAPI } from "../util/callAPIUtil";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function UserCU({
  editable,
  OInfo,
  setEditable,
}: {
  editable: boolean;
  OInfo: inUserT;
  setEditable: Function;
}): React.JSX.Element {
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [newUserType, setNewUserType] = useState(
    OInfo?.Role == 200 ? "cmpAdmin" : "driver"
  );
  const [user, setUser] = useState<NewUser>({
    Name: "",
    Role: newUserType,
    PhoneNum: "",
    BelongCmp: NaN,
    driverInfo: {
      percentage: 0,
      nationalIdNumber: "",
      plateNum: "",
    },
  });
  const roleName =
    OInfo?.Role == 100 ? "管理員" : OInfo?.Role == 200 ? "公司負責人" : "司機";

  const getCmp = useCallback(async () => {
    const cmpList: cmpInfo[] = await (
      await callAPI("/api/cmp/all", "GET", {}, true)
    ).json();
    setCmpList(cmpList);
  }, []);
  const setUp = useCallback(() => {
    if (OInfo) {
      setUser({
        Name: OInfo.Username,
        Role:
          OInfo?.Role == 100
            ? "superAdmin"
            : OInfo?.Role == 200
            ? "cmpAdmin"
            : "driver",
        PhoneNum: OInfo.Phonenum,
        BelongCmp: OInfo.Belongcmp,
        driverInfo: {
          plateNum: OInfo.Platenum?.String ?? "",
          percentage: OInfo.Percentage?.Int16 ?? 0,
          nationalIdNumber: OInfo.Nationalidnumber ?? "",
        },
      });
    }
  }, []);

  useEffect(() => {
    setUp();
    getCmp();
  }, []);
  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      {OInfo && (
        <Pressable
          className="my-1"
          onPress={() => {
            navigation.navigate("editUserInfoP", { OInfo: OInfo });
          }}
        >
          <Text>
            編輯 <Icon source={"lead-pencil"} size={17} />
          </Text>
        </Pressable>
      )}
      <View>
        <View className="my-3 flex flex-row">
          <Text
            className="text-xl"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            姓名：
          </Text>
          <TextInput
            className={`flex-1 text-xl px-3 color-black rounded-xl  ${
              editable ? "border-b-2  border-fuchsia-300" : "border-slate-400"
            }`}
            editable={editable}
            placeholder="姓名"
            onChangeText={(e) => {
              setUser({ ...user, Name: e });
            }}
          >
            {OInfo?.Username}
          </TextInput>
        </View>
        <View className="my-3 flex flex-row">
          <Text
            className="text-xl"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            手機號碼：
          </Text>
          <TextInput
            className={`flex-1 text-xl px-3 color-black rounded-xl  ${
              editable ? "border-b-2  border-fuchsia-300" : "border-slate-400"
            }`}
            editable={editable}
            keyboardType="numeric"
            placeholder="電話號碼"
            onChangeText={(e) => {
              setUser({ ...user, PhoneNum: e });
            }}
          >
            {OInfo?.Phonenum}
          </TextInput>
        </View>

        {editable ? (
          <View className="my-3 flex flex-row">
            <Text
              className="text-xl"
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
                value={OInfo?.Belongcmp}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setUser({ ...user, BelongCmp: item.ID });
                  setIsFocus(false);
                }}
              />
            </View>
          </View>
        ) : (
          <View className="my-3 flex flex-row">
            <Text
              className="text-xl"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              所屬公司：
            </Text>
            <Text
              className=" text-xl px-3 color-black rounded-xl"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              {OInfo?.Cmpname}
            </Text>
          </View>
        )}

        {editable && !(OInfo?.Role == 100) ? (
          <RadioButton.Group
            onValueChange={(newValue) => {
              setNewUserType(newValue);

              setUser({
                Name: user.Name,
                BelongCmp: user.BelongCmp,
                Role: newUserType,
                PhoneNum: user.PhoneNum,
                driverInfo: {
                  nationalIdNumber: OInfo?.Nationalidnumber,
                  percentage: OInfo?.Percentage?.Int16,
                },
              });
            }}
            value={newUserType}
          >
            <View className="my-3 flex flex-row">
              <Text
                className=" dark:text-white text-xl"
                style={{ textAlignVertical: "center" }}
              >
                職位：
              </Text>
              <View className="flex-1 flex flex-row  items-center align-middle">
                <RadioButton value="cmpAdmin" />
                <Text className=" dark:text-white">公司負責人</Text>
              </View>
              <View className="flex-1 flex flex-row  items-center align-middle">
                <RadioButton value="driver" />
                <Text className=" dark:text-white">司機</Text>
              </View>
            </View>
          </RadioButton.Group>
        ) : (
          <View className="my-3 flex flex-row">
            <Text
              className="text-xl"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              職位：
            </Text>
            <Text
              className=" text-xl px-3 color-black rounded-xl"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              {roleName}
            </Text>
          </View>
        )}
        {(newUserType === "driver" && editable) ||
        (OInfo?.Role == 300 && !editable) ? (
          <>
            <View className="my-3 flex flex-row">
              <Text
                className="text-xl"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                身份證：
              </Text>
              <TextInput
                className={`flex-1 text-xl px-3 color-black rounded-xl  ${
                  editable
                    ? "border-b-2  border-fuchsia-300"
                    : "border-slate-400"
                }`}
                placeholder="身份證"
                editable={editable}
                onChangeText={(e) => {
                  setUser({
                    ...user,
                    driverInfo: {
                      percentage: user.driverInfo?.percentage!,
                      plateNum: user.driverInfo?.plateNum,
                      nationalIdNumber: e,
                    },
                  });
                }}
              >
                {OInfo?.Nationalidnumber}
              </TextInput>
            </View>
            <View className="my-3 flex flex-row">
              <Text
                className="text-xl"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                車牌號碼：
              </Text>
              <TextInput
                className={`flex-1 text-xl px-3 color-black rounded-xl  ${
                  editable
                    ? "border-b-2  border-fuchsia-300"
                    : "border-slate-400"
                }`}
                placeholder="車牌號碼"
                editable={editable}
                onChangeText={(e) => {
                  setUser({
                    ...user,
                    driverInfo: {
                      percentage: user.driverInfo?.percentage!,
                      plateNum: e,
                      nationalIdNumber: user.driverInfo?.nationalIdNumber!,
                    },
                  });
                }}
              >
                {OInfo.Platenum?.String}
              </TextInput>
            </View>
            <View className="my-3 flex flex-row">
              <Text
                className="text-xl"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                比率：
              </Text>
              <TextInput
                className={`flex-1 text-xl px-3 color-black rounded-xl ${
                  editable
                    ? "border-b-2  border-fuchsia-300"
                    : "border-slate-400"
                }`}
                placeholder="比率"
                keyboardType="numeric"
                editable={editable}
                onChangeText={(e) => {
                  setUser({
                    ...user,
                    driverInfo: {
                      // ...user.driverInfo,
                      nationalIdNumber: user.driverInfo?.nationalIdNumber!,
                      plateNum: user.driverInfo?.plateNum!,
                      percentage: parseInt(e),
                    },
                  });
                }}
              >
                {OInfo?.Percentage?.Int16}
              </TextInput>
            </View>
          </>
        ) : (
          <></>
        )}
        {editable ? (
          <Pressable
            onPress={async () => {
              if (
                (await callAPI(`/api/user/${OInfo.ID}`, "PUT", user, true))
                  .status == 200
              ) {
                Alert.alert("完成", "成功修改資料", [{ text: "OK" }]);
              }
            }}
          >
            <Text>送出</Text>
          </Pressable>
        ) : (
          <></>
        )}
        {OInfo?.Role == 300 ? <DriverPic showOption={false} /> : <></>}
      </View>
    </SafeAreaView>
  );
}

export default UserCU;
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
