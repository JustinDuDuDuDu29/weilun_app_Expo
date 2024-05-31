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
} from "react-native";
import _data from "../asset/fakeData/_maintain.json";
import MaintainBlock from "../components/MaintainBlock";
import { mInfoT, maintainInfoT } from "../types/maintainT";
import { FAB, Icon, RadioButton } from "react-native-paper";
import { StyleSheet } from "nativewind";
import GoodModal from "../components/GoodModal";
import MGas from "../components/MGas";
import SmallModal from "../components/SmallModal";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import giveMeDate from "../util/giveMeDate";
import { callAPI, callAPIForm } from "../util/callAPIUtil";
import { useAtom } from "jotai";
import { userInfo } from "./Home";
import MaintainM from "../components/MaintainM";
import UploadPic from "../components/UploadPic";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ImgT, imgUrl } from "../types/ImgT";

function Maintain(): React.JSX.Element {
  const cS = usc();

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const getData = useCallback(async () => {
    try {
      const res = await callAPI("/api/repair", "GET", {}, true);
      // console.log("res is ", res);

      if (res.status == 200) {
        const data: maintainInfoT[] = (await res.json()).res;
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getData();
  }, []);

  const [data, setData] = useState<maintainInfoT[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [picModalV, setPicModalV] = useState(false);
  const [type, setType] = useState<string>("gas");
  const [gasLiter, setGasLiter] = useState<mInfoT[]>([]);
  // const [date, setDate] = useState(new giveMeDate().now_yyyymmdd());
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [repairP, setRepairP] = useState<ImgT | imgUrl>();

  const pressFun = () => {
    actionSheetRef.current?.show();
  };
  const [tmpNew, setTmpNew] = useState<mInfoT>({
    id: uuidv4(),
    price: 0,
    quantity: 0,
    name: "92汽油",
  });

  const removeByUUID = (id: string) => {
    setGasLiter(
      gasLiter.filter((el: mInfoT) => {
        return el.id != id;
      })
    );
  };

  const addToGasLiter = () => {
    if (tmpNew.name == "" || tmpNew.price == 0 || tmpNew.quantity == 0) {
      Alert.alert("注意", "好像有東西沒填齊唷", [{ text: "OK" }]);
      return;
    }

    const arr = gasLiter;
    const index = arr.findIndex((el) => {
      return el.id == tmpNew.id;
    });

    if (index >= 0) {
      arr[index] = tmpNew;
    } else {
      arr.push(tmpNew);
    }

    setGasLiter(arr);
    setTmpNew({
      id: uuidv4(),
      price: 0,
      quantity: 0,
      name: "",
    });
    setModalVisible(false);
  };

  const showModal = () => setVisible(true);
  const clearD = () => {
    setType("gas");
    setTmpNew({
      id: uuidv4(),
      price: 0,
      quantity: 0,
      name: "92汽油",
    });
    setVisible(false);
    setModalVisible(false);
    setRepairP(undefined);
    setGasLiter([]);
    setPicModalV(false);
  };
  const hideModal = () => {
    clearD();
    setVisible(false);
  };

  const handleSubmit = async () => {
    const f = new FormData();

    if (type === "gas") {
      if (tmpNew.name == "" || tmpNew.price == 0 || tmpNew.quantity == 0) {
        Alert.alert("注意", "好像有東西沒填齊唷", [{ text: "OK" }]);
        return;
      }
      const arr = gasLiter;
      arr.push(tmpNew);
      setGasLiter(arr);
    }
    if (gasLiter.length == 0) {
      clearD();
      return;
    }

    f.append("repairInfo", JSON.stringify(gasLiter));
    f.append("repairPic", repairP);
    try {
      const res = await callAPIForm(
        `/api/repair?type=${type}`,
        "POST",
        f,
        true
      );

      if (res.status == 200) {
        clearD();
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ww = Dimensions.get("window").width;
  const wh = Dimensions.get("window").height;

  return (
    <SafeAreaView>
      <View className="mx-5 relative">
        <FlatList
          className="h-full"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.ID!.toString()}
          renderItem={({ item }: { item: maintainInfoT }) => (
            <MaintainBlock maintainInfo={item} />
          )}
        />
        {getUserInfo?.Role == 300 && (
          <FAB icon="plus" style={styles.fab} onPress={() => showModal()} />
        )}
      </View>

      <GoodModal visible={visible} hideModal={hideModal}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{
            backgroundColor: cS == "light" ? "#fff" : "#3A3B3C",
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={{
              display: "flex",
              paddingHorizontal: 10,
              backgroundColor: cS == "light" ? "#fff" : "#3A3B3C",
            }}
          >
            <View className="px-3 py-3">
              <MaintainM
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
                    // handle sumit
                    if (type === "gas") {
                      if (
                        tmpNew.name == "" ||
                        tmpNew.price == 0 ||
                        tmpNew.quantity == 0
                      ) {
                        Alert.alert("注意", "好像有東西沒填齊唷", [
                          { text: "OK" },
                        ]);
                        return;
                      }
                    }
                    setPicModalV(true);
                    // await handleSubmit();
                  }}
                >
                  <Text
                    style={{ textAlign: "center", textAlignVertical: "center" }}
                  >
                    下一步
                  </Text>
                </Pressable>
              </View>
              <SmallModal
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
                  <TouchableOpacity activeOpacity={1} className="w-screen">
                    <View
                      className="flex flex-col  items-center h-5/6"
                      style={{
                        margin: 20,
                        backgroundColor: cS == "light" ? "white" : "#3A3B3C",
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
                          className="my-4 bg-lime-200 w-2/3 rounded-xl py-2 "
                        >
                          <Text
                            style={{
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
    bottom: 40,
  },
});

export default Maintain;
