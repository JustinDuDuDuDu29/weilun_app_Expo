import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { mInfoT, maintainInfoT } from "../types/maintainT";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";

function MaintainBlock({
  maintainInfo,
  changeMe,
}: {
  maintainInfo: maintainInfoT;
  changeMe: Function;
}): React.JSX.Element {
  const [isPressed, setIsPressed] = useState(false);
  const navigation = useNavigation<ScreenProp>();
  const ww = Dimensions.get("window").width;
  const wh = Dimensions.get("window").height;

  let displayConcat = "";
  let totalPrice = 0;

  const concatData = (el: mInfoT, index: number, arr: mInfoT[]) => {
    displayConcat += el.itemName;
    totalPrice += el.totalPrice!;
    if (!(index === arr.length - 1)) {
      displayConcat += "、";
    }
  };
  maintainInfo.Repairinfo.forEach(concatData);

  return (
    <SafeAreaView>
      <Pressable
        onLongPress={() => {
          navigation.navigate("maintainInfoP", {
            maintainID: maintainInfo.ID,
            changeMe,
          });
        }}
        onPress={() => {
          // expain the block
          if (isPressed) {
            setIsPressed(!isPressed);
          }

          setIsPressed(!isPressed);
        }}
      >
        <View
          className="flex py-2 px-4 my-1 rounded-xl  bg-blue-200"
          style={{ height: wh * (isPressed ? 0.45 : 0.12222) }}
        >

          <View
            className="flex flex-col justify-between py-3"
            style={{ flex: 1, flexBasis: 1 }}
          >
            <View>
              <View className="flex flex-row">
                <Text allowFontScaling={false}      className=" text-2xl" style={{
                    flex: 1 / 3,
                    flexBasis: 1 / 3,
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                >
                  品名
                </Text>
                <Text allowFontScaling={false}   className=" text-2xl"       style={{
                    flex: 1 / 3,
                    flexBasis: 1 / 3,
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                >
                  數量
                </Text>
                <Text allowFontScaling={false}     className=" text-2xl"        style={{
                    flex: 1 / 3,
                    flexBasis: 1 / 3,
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                >
                  總價
                </Text>
              </View>
              <FlatList
                data={maintainInfo.Repairinfo}
                renderItem={({ item }) => {
                  return (
                    <View className="flex flex-row">
                      <Text allowFontScaling={false}       className=" text-2xl"     style={{
                          flex: 1 / 3,
                          flexBasis: 1 / 3,
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}
                      >
                        {item.itemName}
                      </Text>
                      <Text allowFontScaling={false}     className=" text-2xl"          style={{
                          flex: 1 / 3,
                          flexBasis: 1 / 3,
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <Text allowFontScaling={false}    className=" text-2xl"           style={{
                          flex: 1 / 3,
                          flexBasis: 1 / 3,
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}
                      >
                        {item.totalPrice}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>

            <View>
              {isPressed ?? (
                <View>
                  <Text className=" text-2xl" allowFontScaling={false}>姓名:{maintainInfo.Drivername}</Text>
                  <Text className=" text-2xl" allowFontScaling={false}>
                    日期:
                    {maintainInfo.Createdate.split("T")[0] +
                      " " +
                      maintainInfo.Createdate.split("T")[1].split(".")[0]}
                  </Text>
                </View>
              )}
              <Text className=" text-2xl" allowFontScaling={false}>維修總價:{totalPrice}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default MaintainBlock;
