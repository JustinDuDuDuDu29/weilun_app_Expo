import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { callAPI, callAPIAbort } from "../util/callAPIUtil";
import { NewUser, cmpInfo, userLS } from "../types/userT";
import { StyleSheet } from "nativewind";
import { RadioButton } from "react-native-paper";
import GoodModal from "./GoodModal";

function SearchComp(props: {
  setUsetList: Function;
  visible: boolean;
  hideModal: Function;
  setVisible: Function;
}): React.JSX.Element {
  const [isFocus1, setIsFocus1] = useState(false);
  const [searchVal, setSearchVal] = useState<{
    Name: string;
    ID: string;
    occupied: boolean;
    searchQ: string;
    canSearch: boolean;
  } | null>();
  const [search, setSearch] = useState<
    {
      Name: string;
      ID: string;
      occupied: boolean;
      searchQ: string;
      canSearch: boolean;
    }[]
  >([
    {
      Name: "姓名",
      ID: "Name",
      occupied: false,
      searchQ: "",
      canSearch: false,
    },
    {
      Name: "電話",
      ID: "PhoneNum",
      occupied: false,
      searchQ: "",
      canSearch: false,
    },
    {
      Name: "所屬公司",
      ID: "BelongCmpName",
      occupied: false,
      searchQ: "",
      canSearch: false,
    },
  ]);

  const ctrl: AbortController = new AbortController();
  const signal: AbortSignal = ctrl.signal;

  const getData = useCallback(async () => {
    try {
      let str = "";
      search.forEach((e) => {
        if (e.canSearch) {
          str = str + e.ID + "=" + e.searchQ + "&";
        }
      });

      const data: userLS[] = await (
        await callAPIAbort(
          "/api/user?" + str.replace(/&$/, ""),
          "GET",
          {},
          true,
          signal
        )
      ).json();
      // console.log(data);
      props.setUsetList(data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    getData();
  }, [search]);
  const inp = useRef();

  const [newUserType, setNewUserType] = useState("cmpAdmin");

  const [cmpList, setCmpList] = useState<cmpInfo[]>([]);

  const [cmpName, setCmpName] = useState("");
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
        if (res.status == 200) {
          setCmpName("");
          props.setVisible(false);

          Alert.alert("成功！", "新增公司成功", [{ text: "OK" }]);
        }
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
        if (res.status == 200) {
          setUser({
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
          props.setVisible(false);

          Alert.alert("成功！", "新增成功", [{ text: "OK" }]);
        }
        // console.log(res);
      }
      await getData();
      await getCmp();
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
  return (
    <SafeAreaView>
      <View className="flex flex-row w-full my-2 px-1">
        <View className=" w-1/4">
          <Dropdown
            style={[styles.dropdown, isFocus1 && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={search.filter((e) => !e.occupied)}
            labelField="Name"
            valueField="ID"
            placeholder={!isFocus1 ? "條件" : "..."}
            value={searchVal}
            onFocus={() => setIsFocus1(true)}
            onBlur={() => setIsFocus1(false)}
            onChange={(item) => {
              setSearchVal(item);
              setIsFocus1(false);
            }}
          />
        </View>
        <View className=" mx-1 flex-1 flex justify-center border-2 border-gray-300 onFocus rounded">
          <TextInput
            className="px-2 flex items-center align-middle"
            // style={{ verticalAlign: "center" }}
            placeholder="請輸入條件"
            ref={inp}
            onChangeText={(e) => {
              if (searchVal) {
                ctrl.abort();
                setSearch(
                  search.map((el, i) => {
                    if (el.ID == searchVal.ID) {
                      return {
                        ...el,
                        canSearch: e == "" ? false : true,
                        searchQ: e,
                      };
                    }
                    return el;
                  })
                );
              }
            }}
          />
        </View>
      </View>
      <View className="flex mb-2 items-center ">
        <Pressable
          className="bg-sky-400  rounded-full  w-11/12 py-1"
          onPress={() => {
            if (searchVal) {
              const arr = search.map((e) => {
                if (e.ID == searchVal.ID) {
                  return { ...e, occupied: true };
                }
                return e;
              });
              setSearch(arr);
              setSearchVal(null);
            }
            inp.current.clear();
          }}
        >
          <Text
            style={{ textAlign: "center", verticalAlign: "middle" }}
            className="text-lg font-semibold text-white"
          >
            新增
          </Text>
        </Pressable>
      </View>

      <View className="flex flex-row flex-wrap px-2">
        {search.map((el) => {
          if (el.occupied) {
            return (
              <Pressable
                className="px-3 bg-green-100  border-green-800 rounded-full -px3 py-1 mr-2 border w-fit "
                key={el.ID}
                onPress={() => {
                  setSearch(
                    search.map((e) => {
                      if (e.ID == el.ID) {
                        return {
                          ...e,
                          occupied: false,
                          searchQ: "",
                          canSearch: false,
                        };
                      }
                      return e;
                    })
                  );
                }}
              >
                <Text className="text-lg font-semibold text-green-800 ">
                  {el.Name}:{el.searchQ}
                </Text>
              </Pressable>
            );
          }
          return;
        })}
      </View>
      <GoodModal visible={props.visible} hideModal={props.hideModal}>
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
                              placeholder="車牌號碼"
                              onChangeText={(e) => {
                                setUser({
                                  ...user,
                                  driverInfo: {
                                    percentage: user.driverInfo?.percentage!,
                                    nationalIdNumber:
                                      user.driverInfo?.nationalIdNumber,
                                    plateNum: e,
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
                                    plateNum: user.driverInfo?.plateNum,
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

export default SearchComp;
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
    // height: 50,
    borderColor: "gray",
    // borderWidth: 0.5,
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
