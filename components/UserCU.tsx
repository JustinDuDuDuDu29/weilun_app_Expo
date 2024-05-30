import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  Pressable,
  Alert,
  useColorScheme as usc,
} from "react-native";
import { NewUser, cmpInfo, inUserT } from "../types/userT";

import { StyleSheet } from "nativewind";
import { Icon, RadioButton } from "react-native-paper";
import { callAPI } from "../util/callAPIUtil";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPicAdmin from "./DriverPicAdmin";

function UserCU({
  editable,
  OInfo,
  setEditable,
}: {
  editable: boolean;
  OInfo: inUserT;
  setEditable: Function;
}): React.JSX.Element {
  const cS = usc();

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
      // percentage: 0,
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
          // percentage: OInfo.Percentage?.Int32 ?? 0,
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
          <Text className="dark:text-white">
            編輯{" "}
            <Icon
              source={"lead-pencil"}
              size={17}
              color={cS == "light" ? "#000" : "#fff"}
            />
          </Text>
        </Pressable>
      )}
      <View>
        <View className="my-3 flex flex-row">
          <Text
            className="text-xl dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            姓名：
          </Text>
          <Text
            className={`flex-1 text-xl px-3 color-black rounded-xl  border-slate-400 dark:text-white`}
          >
            {OInfo?.Username}
          </Text>
        </View>
        <View className="my-3 flex flex-row">
          <Text
            className="text-xl  dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            手機號碼：
          </Text>
          <Text
            className={`flex-1 text-xl px-3 color-black rounded-xl border-slate-400  dark:text-white`}
          >
            {OInfo?.Phonenum}
          </Text>
        </View>

        <View className="my-3 flex flex-row">
          <Text
            className="text-xl dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            所屬公司：
          </Text>
          <Text
            className=" text-xl px-3 color-black rounded-xl  dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            {OInfo?.Cmpname}
          </Text>
        </View>

        <View className="my-3 flex flex-row">
          <Text
            className="text-xl  dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            職位：
          </Text>
          <Text
            className=" text-xl px-3 color-black rounded-xl  dark:text-white"
            style={{ textAlign: "center", textAlignVertical: "center" }}
          >
            {roleName}
          </Text>
        </View>
        {OInfo?.Role == 300 ? (
          <>
            <View className="my-3 flex flex-row">
              <Text
                className="text-xl  dark:text-white"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                身份證：
              </Text>
              <Text
                className={`flex-1 text-xl px-3 color-black rounded-xl  border-slate-400  dark:text-white`}
              >
                {OInfo?.Nationalidnumber}
              </Text>
            </View>
            <View className="my-3 flex flex-row">
              <Text
                className="text-xl  dark:text-white"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                車牌號碼：
              </Text>
              <Text
                className={`flex-1 text-xl px-3 color-black rounded-xl border-slate-400  dark:text-white`}
              >
                {OInfo.Platenum?.String}
              </Text>
            </View>
            {/* <View className="my-3 flex flex-row">
              <Text
                className="text-xl dark:text-white"
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                比率：
              </Text>
              <Text
                className={`flex-1 text-xl px-3 color-black rounded-xl dark:text-white border-slate-400 `}
              >
                {OInfo?.Percentage?.Int32}
              </Text>
            </View> */}
          </>
        ) : (
          <></>
        )}
        {OInfo?.Role == 300 ? (
          <DriverPicAdmin showOption={true} getUserInfo={OInfo} />
        ) : (
          <></>
        )}
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
