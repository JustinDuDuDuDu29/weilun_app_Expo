import React from "react";
import { SafeAreaView, View, Dimensions, Pressable, Text } from "react-native";
import { Icon } from "react-native-paper";
import lineLogo from "../asset/line.png";
import phoneLogo from "../asset/telephone.png";
import { Linking } from "react-native";

function CustomerS(): React.JSX.Element {
  const ww = Dimensions.get("window").width;
  return (
    <SafeAreaView className="h-full flex justify-center content-center">
      <View className="flex flex-row justify-around content-center">
        <Pressable
          onPress={() => {
            Linking.openURL("https://line.me/ti/p/Q456k_ed6l");
          }}
          className="flex flex-col justify-self-center justify-center "
        >
          <View>
            <Icon source={lineLogo} size={ww * 0.38} />
          </View>
          <View className="flex flex-row justify-center align-middle">
            <Text allowFontScaling={false}className="text-2xl text-black dark:text-white">
              Line客服
            </Text>
          </View>
        </Pressable>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "black",
          }}
        />
        <Pressable
          onPress={() => {
            Linking.openURL("tel:0928976176");
          }}
          className="flex flex-col justify-self-center justify-center "
        >
          <View>
            <Icon source={phoneLogo} size={ww * 0.38} />
          </View>
          <View className="flex flex-row justify-center align-middle">
            <Text allowFontScaling={false}className="text-2xl dark:text-white">客服專線</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default CustomerS;
