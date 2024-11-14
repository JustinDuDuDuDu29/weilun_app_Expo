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
      {type === "gas" ? (
        <View>
          <RadioButton.Group
            onValueChange={(selected) => {
              // setNewInfo({...newInfo, name: selected});
              setTmpNew({ ...tmpNew, itemName: selected });
            }}
            value={tmpNew.itemName!}
          >
            <View>
              <Text className="text-2xl dark:text-white">請選擇種類：</Text>
              <View className="flex flex-col">
                <View className="flex flex-row  items-center align-middle">
                  {/* <View className=" border my-3 rounded-full"> */}
                  <RadioButton value="92汽油" />
                  {/* </View> */}
                  <Text className="text-xl dark:text-white">92汽油</Text>
                </View>

                <View className="flex flex-row  items-center align-middle">
                  {/* <View className=" border my-3 rounded-full"> */}
                  <RadioButton value="95汽油" />
                  {/* </View> */}
                  <Text className="text-xl dark:text-white">95汽油</Text>
                </View>

                <View className="flex flex-row  items-center align-middle">
                  {/* <View className=" border my-3 rounded-full"> */}
                  <RadioButton value="98汽油" />
                  {/* </View> */}
                  <Text className="text-xl dark:text-white">98汽油</Text>
                </View>

                <View className="flex flex-row  items-center align-middle">
                  {/* <View className=" border my-3 rounded-full"> */}
                  <RadioButton value="超級柴油" />
                  {/* </View> */}
                  <Text className="text-xl dark:text-white">超級柴油</Text>
                </View>
              </View>
            </View>
          </RadioButton.Group>

          <View className="my-2">
            {/* <Text className="text-xl dark:text-white">公升數:</Text> */}
            <TextInput
              label={"公升數"}
              keyboardType="number-pad"
              onChangeText={(e) => {
                setTmpNew({ ...tmpNew, quantity: parseInt(e) });
              }}
            />
          </View>
          <View className="my-2">
            {/* <Text className="text-xl dark:text-white">總價:</Text> */}
            <TextInput
              label={"總價"}
              keyboardType="number-pad"
              onChangeText={(e) => {
                setTmpNew({ ...tmpNew, totalPrice: parseInt(e) });
              }}
            />
          </View>
        </View>
      ) : (
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
                      <Text className="text-xl">品名：{item.item.itemName}</Text>
                      <Text className="text-xl">
                        數量：{item.item.quantity}
                      </Text>
                      <Text className="text-xl">總價：{item.item.totalPrice}</Text>
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
      )}
    </Pressable>
  );
}

export default MGas;
