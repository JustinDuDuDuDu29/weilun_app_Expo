import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { mInfoT } from "../types/maintainT";
import { Icon, RadioButton, TextInput } from "react-native-paper";

function MGas(
  this: any,
  {
    tmpNew,
    setTmpNew,
    type,
    removeByUUID,
    gasLiter,
    setModalVisible,
  }: {
    tmpNew: mInfoT;
    setTmpNew: Function;
    type: string;
    removeByUUID: Function;
    gasLiter: mInfoT[];
    setModalVisible: Function;
  }
): React.JSX.Element {
  const ww = Dimensions.get("window").width;

  const [newInfo, setNewInfo] = useState({ name: "" });

  return (
    <Pressable>
        <View className="flex flex-col" style={{ maxHeight: 400 }}>
          <FlatList
            className=" w-full"
            data={gasLiter}
            scrollEnabled={true}
            extraData={this.state}
            showsHorizontalScrollIndicator
            showsVerticalScrollIndicator
            renderItem={(item) => {
              return (
                <Pressable className="flex flex-row w-full py-2">
                  <View className="flex flex-row justify-between w-full bg-neutral-300 rounded-lg px-4 py-2">
                    <View className="flex flex-col">
                      <Text allowFontScaling={false}className="text-2xl">品名：{item.item.itemName}</Text>
                      <Text allowFontScaling={false}className="text-2xl">
                        數量：{item.item.quantity}
                      </Text>
                      {type == "gas" ?<Text allowFontScaling={false}className="text-2xl">總價：{item.item.totalPrice}</Text>: <></>}
                    </View>
                    <View className="flex flex-row items-center ">
                      <Pressable
                        onPress={(e) => {
                          // edit the item
                          setTmpNew(item.item);
                          setModalVisible(true);
                        }}
                      >
                        <Icon source={"pencil-outline"} size={ww * 0.1} />
                      </Pressable>
                      <Pressable
                        onPress={(e) => {
                          removeByUUID(item.item.id);
                        }}
                      >
                        <Icon source={"trash-can-outline"} size={ww * 0.1} />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            // keyExtractor={(item) => item.!.toString()}
          />
        </View>
    </Pressable>
  );
}

export default MGas;
