import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View, Text, Dimensions } from "react-native";
import { ImgT, imgUrl } from "../types/ImgT";
import plus from "../asset/plus.png";
import ChoosePicDrawer from "./ChoosePicDrawer";
import { ActionSheetRef } from "react-native-actions-sheet";
import { Image } from "expo-image";
import ShowMeMorePic from "./ShowMeMorePic";

const UploadPic = ({
  pressFun,
  canPress,
  src,
  actionSheetRef,
  tarFun,
  showText,
  showOption,
}: {
  pressFun: Function;
  canPress: boolean;
  src: ImgT | imgUrl;
  actionSheetRef: React.RefObject<ActionSheetRef>;
  tarFun: Function;
  showText: string;
  showOption: boolean;
}): React.JSX.Element => {
  useEffect(() => {}, [src]);
  const wh = Dimensions.get("window").height;
  const ww = Dimensions.get("window").width;

  const [visible, setVisible] = useState<boolean>(false);

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <SafeAreaView>
      {src ? (
        <Pressable
          className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200"
          style={{ height: wh * 0.3, width: ww * 0.4, overflow: "hidden" }}
          onPress={() => {
            if (!canPress) {
              setVisible(true);
              return;
            }
            pressFun();
          }}
        >
          <Image source={src} style={{ width: "102%", height: "102%" }}></Image>
        </Pressable>
      ) : (
        <Pressable
          className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 "
          style={{ height: wh * 0.3, width: ww * 0.4 }}
          onPress={() => {
            if (!canPress) {
              return;
            }
            pressFun();
          }}
        >
          <Text>
            {showOption && canPress ? "按我" : "尚未"}上傳{showText}照片
          </Text>
        </Pressable>
      )}
      <ChoosePicDrawer actionSheetRef={actionSheetRef} tarFun={tarFun} />
      <ShowMeMorePic visible={visible} hideModal={hideModal}>
        <View>
          <Image source={src} style={{ width: "100%", height: "100%" }}></Image>
        </View>
      </ShowMeMorePic>
    </SafeAreaView>
  );
};

export default UploadPic;
