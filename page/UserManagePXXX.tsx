import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { callAPI, callAPIAbort } from "../util/callAPIUtil";
import { NewUser, cmpInfo, inUserT } from "../types/userT";
import UseListEl from "../components/UserListEl";
import { FAB, RadioButton, TextInput } from "react-native-paper";
import { StyleSheet } from "nativewind";
import GoodModal from "../components/GoodModal";

import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchComp from "../components/SearchComp";

function UserManageP(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [newUserType, setNewUserType] = useState("cmpAdmin");

  const [userList, setUsetList] = useState<inUserT[]>([]);
  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [cmpName, setCmpName] = useState("");
  const [user, setUser] = useState<NewUser>({
    Name: "",
    Role: newUserType,
    PhoneNum: "",
    BelongCmp: NaN,
    driverInfo: {
      percentage: 0,
      nationalIdNumber: "",
    },
  });
  useEffect(() => {
    setUser({ ...user, Role: newUserType });
  }, [newUserType]);

  const [type, setType] = useState<string>("user");

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  async function handleSubmit() {
    try {
      if (type === "cmp") {
        if (cmpName == "") {
          Alert.alert("注意！", "請輸入公司名稱唷～", [{ text: "OK" }]);
          return;
        }
        const res = await callAPI(
          "/api/cmp",
          "POST",
          { cmpName: `${cmpName}` },
          true
        );
        if (res.status == 200)
          Alert.alert("成功！", "新增公司成功", [{ text: "OK" }]);
      } else {
        if (user.Name == "" || user.PhoneNum == "" || user.BelongCmp == null) {
          Alert.alert("注意！", "請確認資料是否完整", [{ text: "OK" }]);
          return;
        }
        if (
          user.Role == "driver" &&
          (user.driverInfo?.nationalIdNumber == "" ||
            user.driverInfo?.percentage == 0)
        ) {
          Alert.alert("注意！", "請確認資料是否完整", [{ text: "OK" }]);
          return;
        }
        const res = await callAPI(
          `/api/user?userType=${user.Role}`,
          "POST",
          user,
          true
        );
        if (res.status == 200)
          Alert.alert("成功！", "新增成功", [{ text: "OK" }]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCmp = useCallback(async () => {
    const cmpList: cmpInfo[] = await (
      await callAPI("/api/cmp/all", "GET", {}, true)
    ).json();
    setCmpList(cmpList);
  }, []);
  useEffect(() => {
    getCmp();
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <SearchComp setUsetList={setUsetList} />
      <View className="px-3 py-2 relative h-full">
        <FlatList
          data={userList}
          renderItem={({ item }) => <UseListEl info={item} />}
          keyExtractor={(item) => item.ID.toString()}
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
            <View className="flex flex-col justify-between">
              <View>
                <Text className=" dark:text-white">請選擇類別：</Text>
                <View className="flex flex-row justify-between">
                  <RadioButton.Group
                    onValueChange={(newValue) => {
                      setCmpName("");
                      setType(newValue);
                    }}
                    value={type}
                  >
                    <View className="flex flex-col">
                      <View className="flex flex-row  items-center align-middle">
                        <RadioButton value="user" />
                        <Text className=" dark:text-white">新增使用者</Text>
                      </View>
                      <View className="flex flex-row  items-center align-middle">
                        <RadioButton value="cmp" />
                        <Text className=" dark:text-white">新增公司</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
              <View>
                {type === "user" ? (
                  <>
                    <View>
                      <View>
                        <TextInput
                          placeholder="姓名"
                          onChangeText={(e) => {
                            setUser({ ...user, Name: e });
                          }}
                        />
                      </View>
                      <View>
                        <TextInput
                          placeholder="電話號碼"
                          onChangeText={(e) => {
                            setUser({ ...user, PhoneNum: e });
                          }}
                        />
                      </View>
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocus && { borderColor: "blue" },
                        ]}
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
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                          setUser({ ...user, BelongCmp: item.ID });
                          setIsFocus(false);
                        }}
                      />
                      <RadioButton.Group
                        onValueChange={(newValue) => {
                          setUser({
                            Name: user.Name,
                            BelongCmp: user.BelongCmp,
                            Role: user.Role,
                            PhoneNum: user.PhoneNum,
                          });
                          setNewUserType(newValue);
                        }}
                        value={newUserType}
                      >
                        <View className="flex flex-row">
                          <Text
                            className=" dark:text-white"
                            style={{ textAlignVertical: "center" }}
                          >
                            職位：
                          </Text>
                          <View className="flex flex-row  items-center align-middle">
                            <RadioButton value="cmpAdmin" />
                            <Text className=" dark:text-white">公司負責人</Text>
                          </View>
                          <View className="flex flex-row  items-center align-middle">
                            <RadioButton value="driver" />
                            <Text className=" dark:text-white">司機</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      {newUserType === "driver" ? (
                        <>
                          <View>
                            <TextInput
                              placeholder="身份證"
                              onChangeText={(e) => {
                                setUser({
                                  ...user,
                                  driverInfo: {
                                    percentage: user.driverInfo?.percentage!,
                                    nationalIdNumber: e,
                                  },
                                });
                              }}
                            />
                          </View>
                          <View>
                            <TextInput
                              placeholder="比率"
                              onChangeText={(e) => {
                                setUser({
                                  ...user,
                                  driverInfo: {
                                    // ...user.driverInfo,
                                    nationalIdNumber:
                                      user.driverInfo?.nationalIdNumber!,
                                    percentage: parseInt(e),
                                  },
                                });
                              }}
                            />
                          </View>
                        </>
                      ) : (
                        <></>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <Text className=" dark:text-white">{cmpName}</Text>
                    <TextInput
                      placeholder="公司名稱"
                      onChangeText={(e) => {
                        setCmpName(e);
                      }}
                    />
                  </>
                )}
              </View>
              <View className="bg-blue-400 py-3 mt-3">
                <Pressable
                  onPress={() => {
                    // handle sumit
                    handleSubmit();
                  }}
                >
                  <Text
                    className=" dark:text-white"
                    style={{ textAlign: "center", textAlignVertical: "center" }}
                  >
                    送出
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </GoodModal>
    </SafeAreaView>
  );
}

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

export default UserManageP;
