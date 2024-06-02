import React, { useState } from "react";
import { Pressable, SafeAreaView, View, Text, Dimensions } from "react-native";
import { RadioButton, Icon, TextInput } from "react-native-paper";
import MGas from "./MGas";
import { v4 as uuidv4 } from "uuid";
import { mInfoT } from "../types/maintainT";

function MaintainM({
  type,
  setType,
  setGasLiter,
  setTmpNew,
  setModalVisible,
  tmpNew,
  removeByUUID,
  gasLiter,
  setPlace,
}: {
  type: string;
  setType: Function;
  setGasLiter: Function;
  setTmpNew: Function;
  setModalVisible: Function;
  tmpNew: mInfoT;
  removeByUUID: Function;
  gasLiter: mInfoT[];
  setPlace: Function;
}): React.JSX.Element {
  const ww = Dimensions.get("window").width;

  return (
    <SafeAreaView>
      <View className="flex flex-col justify-between">
        <Text className="text-2xl dark:text-white">請選擇類別：</Text>
        <View className="flex flex-row justify-between">
          <View>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setType(newValue);
                setGasLiter([]);

                if (newValue == "gas") {
                  setTmpNew({
                    id: uuidv4(),
                    price: 0,
                    quantity: 0,
                    name: "92汽油",
                  });
                  return;
                }
                setTmpNew({
                  id: uuidv4(),
                  price: 0,
                  quantity: 0,
                  name: "",
                });
              }}
              value={type}
            >
              <View className="flex flex-col">
                <View className="flex flex-row  items-center align-middle">
                  <RadioButton value="gas" />
                  <Text className="text-xl dark:text-white">加油</Text>
                </View>
                <View className="flex flex-row  items-center align-middle">
                  <RadioButton value="maintain" />
                  <Text className="text-xl dark:text-white">保養及維修</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          {type === "gas" ? (
            <></>
          ) : (
            <View className="h-full flex  items-center align-middle content-center justify-center flex-row">
              <Pressable
                className="bg-blue-300 flex rounded-full"
                onPress={(e) => {
                  setTmpNew({
                    id: uuidv4(),
                    price: 0,
                    quantity: 0,
                    name: "",
                  });
                  setModalVisible(true);
                }}
              >
                <Icon source={"plus"} size={ww * 0.15} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <MGas
        type={type}
        tmpNew={tmpNew}
        setTmpNew={setTmpNew}
        removeByUUID={removeByUUID}
        gasLiter={gasLiter}
        setModalVisible={setModalVisible}
      />
      {/* <Text className="text-xl dark:text-white">地點：</Text> */}
      <View className="my-2">
        <TextInput
          label={"地點"}
          className="text-xl"
          onChangeText={(e) => {
            setPlace(e);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default MaintainM;
