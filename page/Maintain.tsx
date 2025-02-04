import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  Pressable,
  Alert,
  Text,
  useColorScheme as usc,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import MaintainBlock from "../components/MaintainBlock";
import { mInfoT, maintainInfoT } from "../types/maintainT";
import { FAB, Icon } from "react-native-paper";
import GoodModal from "../components/GoodModal";
import SmallModal from "../components/SmallModal";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { callAPI, callAPIForm } from "../util/callAPIUtil";
import { useAtom, useStore } from "jotai";
import MaintainM from "../components/MaintainM";
import UploadPic from "../components/UploadPic";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ImgT, imgUrl } from "../types/ImgT";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import { fnAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function Maintain({ uid }: { uid: number }): React.JSX.Element {
  const cS = usc();
  const [jobInfo, setJobInfo] = useState<{ [key: string]: maintainInfoT[] }>(
    {}
  );
  const [dd, setData] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({});
  const store = useStore();
  const [canPress, setCanPress] = useState<boolean>(false);
  // store.get(fnAtom).getUserInfofn()
  const getData = useCallback(async () => {
    try {
      const res = await callAPI(
        `/api/repair/cj?id=${
          store.get(fnAtom).getUserInfofn()?.Role === 100
            ? uid
            : store.get(fnAtom).getUserInfofn()?.ID
        }`,
        "GET",
        {},
        true
      );
      if (!res.ok) {
        throw res;
      }
      const data: string[] = await res.json();

      setData(data);
      data.forEach((e) => {
        setJobInfo((oldArray) => ({ ...oldArray, [e]: [] }));
        setVisibility((oldVisibility) => ({ ...oldVisibility, [e]: false }));
      });
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
  }, [uid]);

  useEffect(() => {
    getData();
  }, [getData]);

  const navigation = useNavigation<ScreenProp>();

  const toggleVisibility = async (key: string) => {
    if (!visibility[key]) {
      if (jobInfo[key].length === 0) {
        try {
          const res = await callAPI(
            `/api/repair?driverid=${
              store.get(fnAtom).getUserInfofn()?.Role === 100
                ? uid
                : store.get(fnAtom).getUserInfofn()?.ID
            }&ym=${key}`,
            "GET",
            {},
            true
          );
          if (!res.ok) {
            throw res;
          }
          const data = await res.json();
          setJobInfo({ ...jobInfo, [key]: data.res });
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
            Alert.alert("GG", `怪怪\n${err}`, [
              { text: "OK", onPress: () => {} },
            ]);
          }
        }
      }
    }
    setVisibility({ ...visibility, [key]: !visibility[key] });
  };

  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [picModalV, setPicModalV] = useState(false);
  const [type, setType] = useState<string>("maintain");
  const [gasLiter, setGasLiter] = useState<mInfoT[]>([]);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [repairP, setRepairP] = useState<ImgT | imgUrl>();

  const pressFun = () => {
    actionSheetRef.current?.show();
  };
  const [place, setPlace] = useState<string>("");

  const [tmpNew, setTmpNew] = useState<mInfoT>({
    id: uuidv4(),
    totalPrice: 0,
    quantity: 0,
    itemName: "",
    create_date: "",
    // place: "",
  });

  const removeByUUID = (id: string) => {
    setGasLiter(gasLiter.filter((el: mInfoT) => el.id !== id));
  };

  const addToGasLiter = () => {
    if (
      tmpNew.itemName === "" ||
      // tmpNew.totalPrice === 0 ||
      tmpNew.quantity === 0
    ) {
      Alert.alert("注意", "好像有東西沒填齊唷", [{ text: "OK" }]);
      return;
    }

    const arr = gasLiter;
    const index = arr.findIndex((el) => el.id === tmpNew.id);

    if (index >= 0) {
      arr[index] = tmpNew;
    } else {
      arr.push(tmpNew);
    }

    setGasLiter(arr);
    setTmpNew({
      id: uuidv4(),
      totalPrice: 0,
      quantity: 0,
      itemName: "",
      create_date: "",
    });
    setModalVisible(false);
  };

  const showModal = () => setVisible(true);
  const clearD = () => {
    setType("maintain");
    setTmpNew({
      id: uuidv4(),
      totalPrice: 0,
      quantity: 0,
      itemName: "",
      create_date: "",
    });
    setVisible(false);
    setModalVisible(false);
    setRepairP(undefined);
    setGasLiter([]);
    setPicModalV(false);
    setPlace("");
  };

  const hideModal = () => {
    clearD();
    setVisible(false);
  };

  const handleSubmit = async () => {
    setCanPress(true);
    const f = new FormData();

    if (type === "gas") {
      if (
        tmpNew.itemName === "" ||
        tmpNew.totalPrice === 0 ||
        tmpNew.quantity === 0
      ) {
        Alert.alert("注意", "好像有東西沒填齊唷", [{ text: "OK" }]);
        return;
      }
      const arr = gasLiter;
      arr.push(tmpNew);
      setGasLiter(arr);
    }
    if (gasLiter.length === 0) {
      
      Alert.alert("錯誤", "似乎有東西沒有填好呢", [{ text: "OK" }])
      clearD();
      return;
    }

    f.append("repairInfo", JSON.stringify(gasLiter));
    f.append("repairPic", repairP);
    f.append("place", place);
    try {
      const res = await callAPIForm(`/api/repair`, "POST", f, true);

      if (res.status === 200) {
        clearD();
        getData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCanPress(false);
    }
  };

  const ww = Dimensions.get("window").width;
  const wh = Dimensions.get("window").height;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View className="py-4 px-3">
        <View className="mx-5 relative h-full">
          <FlatList
            data={dd}
            keyExtractor={(item) => item}
            renderItem={({ item: key }) => (
              <View key={key}>
                <Pressable
                  className="my-1 rounded-lg px-4 py-2 bg-red-200 flex flex-row justify-between"
                  onPress={() => toggleVisibility(key)}
                >
                  <View>
                    <Text className="text-2xl" allowFontScaling={false}>{key}</Text>
                  </View>
                  <View
                    className={`${
                      visibility[key] ? "rotate-180" : "rotate-90"
                    }`}
                  >
                    <Icon source={"triangle"} size={15} />
                  </View>
                </Pressable>
                {visibility[key] && (
                  <>
                    <FlatList
                      className="h-full"
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      data={jobInfo[key]}
                      keyExtractor={(item) => {
                        return item.ID!.toString();
                      }}
                      renderItem={({ item }: { item: maintainInfoT }) => (
                        <MaintainBlock maintainInfo={item} />
                      )}
                    />
                  </>
                )}
              </View>
            )}
          />
          {store.get(fnAtom).getUserInfofn()?.Role === 300 && (
            <FAB icon="plus" style={styles.fab} onPress={() => showModal()} />
          )}
        </View>
      </View>
      <GoodModal visible={visible} hideModal={hideModal}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{
            backgroundColor: cS === "light" ? "#fff" : "#3A3B3C",
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={{
              // display: "flex",
              paddingHorizontal: 10,
              backgroundColor: cS === "light" ? "#fff" : "#3A3B3C",
            }}
          >
            <ScrollView
              className="px-3 py-3"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <MaintainM
                setPlace={setPlace}
                type={type}
                setType={setType}
                setGasLiter={setGasLiter}
                setTmpNew={setTmpNew}
                setModalVisible={setModalVisible}
                tmpNew={tmpNew}
                removeByUUID={removeByUUID}
                gasLiter={gasLiter}
              />
              <View className="bg-blue-400 py-3 mt-3 rounded-xl">
                <Pressable
                  onPress={async () => {
                    // if (type === "gas") {
                    //   if (
                    //     tmpNew.itemName === "" ||
                    //     // tmpNew.totalPrice === 0 ||
                    //     tmpNew.quantity === 0
                    //   ) {
                    //     Alert.alert("注意", "好像有東西沒填齊唷", [
                    //       { text: "OK" },
                    //     ]);
                    //     return;
                    //   }
                    // }
                    if (gasLiter.length == 0) {
                      Alert.alert("錯誤", "似乎有東西沒有填好呢", [{ text: "OK" }])
                      return
                    }
                    setPicModalV(true);
                  }}
                >
                  <Text allowFontScaling={false}   className="text-2xl"   style={{
                      textAlign: "center",
                      textAlignVertical: "center",
                    }}
                  >
                    下一步
                  </Text>
                </Pressable>
              </View>
              <SmallModal
                type="maintain"
                tmpNew={tmpNew}
                setTmpNew={setTmpNew}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                addToGasLiter={addToGasLiter}
              />
              <Modal
                animationType="slide"
                transparent={true}
                visible={picModalV}
                onRequestClose={() => {
                  setPicModalV(!picModalV);
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setPicModalV(false);
                  }}
                  className="flex justify-center content-center"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    flex: 1,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    className="w-screen"
                    onPress={() => {
                      setPicModalV(false);
                    }}
                  >
                    <View
                      className="flex flex-col  items-center h-5/6"
                      style={{
                        margin: 20,
                        backgroundColor: cS === "light" ? "white" : "#3A3B3C",
                        borderRadius: 20,
                        padding: 25,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                      }}
                    >
                      <UploadPic
                        type="big"
                        pressFun={pressFun}
                        canPress={true}
                        src={repairP}
                        actionSheetRef={actionSheetRef}
                        tarFun={setRepairP}
                        showText={"收據"}
                        showOption={false}
                      />
                      {repairP && (
                        <Pressable
                          onPress={async () => {
                            await handleSubmit();
                          }}
                          disabled={canPress}
                          className="my-4 bg-lime-200 w-2/3 rounded-xl py-2 "
                        >
                          <Text allowFontScaling={false}      className="text-2xl"     style={{
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            送出
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
              {/* </View> */}
            </ScrollView>
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
    bottom: 40,
  },
});

export default Maintain;
