import React, { useEffect, useState } from "react";
import {
  useColorScheme as usc,
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { mInfoT } from "../types/maintainT";

function SmallModal({
  type,
  modalVisible,
  setModalVisible,
  addToGasLiter,
  tmpNew,
  setTmpNew,
}: {
  type: string,
  modalVisible: boolean;
  setModalVisible: Function;
  addToGasLiter: Function;
  tmpNew: mInfoT;
  setTmpNew: Function;
}): React.JSX.Element {
  const cS = usc();
  const [canPress, setCanPress] = useState(false);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
          }}
          className="flex justify-center content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          // style={styles.container}
          >
            {/* <TouchableOpacity activeOpacity={1} className="w-screen"> */}
            <View
              style={{
                margin: 20,
                backgroundColor: cS == "light" ? "white" : "#3A3B3C",
                borderRadius: 20,
                padding: 35,
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
              <View className="py-2">
                <TextInput
                  label="品名"
                  mode="outlined"
                  value={tmpNew.itemName!}
                  onChangeText={(e) => {
                    setTmpNew((prev: mInfoT) => {
                      return { ...prev, itemName: e };
                    });
                  }}
                />
              </View>
              <View className="py-2">
                <TextInput
                  onChangeText={(e) => {
                    setTmpNew((prev: mInfoT) => {
                      e = e == "" ? 0 : e;
                      return { ...prev, quantity: parseInt(e) };
                    });
                  }}
                  keyboardType={
                    Platform.OS === "android" ? "numeric" : "number-pad"
                  }
                  defaultValue={
                    tmpNew.quantity! ? tmpNew.quantity!.toString() : ""
                  }
                  label="數量"
                  mode="outlined"
                />
              </View>
              {type == "gas" ?
                <View className="py-2">

                  <TextInput
                    onChangeText={(e) => {
                      setTmpNew((prev: mInfoT) => {
                        e = e == "" ? 0 : e;
                        return { ...prev, totalPrice: parseInt(e) };
                      });
                    }}
                    defaultValue={tmpNew.totalPrice! ? tmpNew.totalPrice!.toString() : ""}
                    label="總價"
                    keyboardType={
                      Platform.OS === "android" ? "numeric" : "number-pad"
                    }
                    mode="outlined"
                  />
                </View> : <></>
              }
              <View className="flex flex-row ">
                <Pressable
                  className="flex-1 h-full py-4"
                  onPress={() => {
                    try {
                      setCanPress(true);

                      addToGasLiter();
                    } catch (error) {
                      console.log(error);
                    } finally {
                      setCanPress(false);
                    }
                  }}
                  disabled={canPress}
                >
                  <Text
                    className="text-center text-xl dark:text-white"
                    style={{ textAlignVertical: "center" }}
                  >
                    送出
                  </Text>
                </Pressable>
                <View
                  style={{
                    borderLeftWidth: 1,
                    borderLeftColor: cS == "light" ? "black" : "white",
                  }}
                />
                <Pressable
                  className="flex-1  py-4"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text
                    className="text-center text-xl dark:text-white"
                    style={{ textAlignVertical: "center" }}
                  >
                    取消
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
          {/* </TouchableOpacity> */}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SmallModal;
