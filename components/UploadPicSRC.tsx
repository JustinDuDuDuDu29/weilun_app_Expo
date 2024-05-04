import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { ImgT, imgUrl } from "../types/ImgT";
import plus from "../asset/plus.png";
import ChoosePicDrawer from "./ChoosePicDrawer";
import { ActionSheetRef } from "react-native-actions-sheet";
import { Image } from "expo-image";
const UploadPic = ({
  pressFun,
  canPress,
  src,
  actionSheetRef,
  tarFun,
}: {
  pressFun: Function;
  canPress: boolean;
  src: ImgT | imgUrl;
  actionSheetRef: React.RefObject<ActionSheetRef>;
  tarFun: Function;
}): React.JSX.Element => {
  useEffect(() => {}, [src]);

  const [toR, setToR] = useState();

  return (
    <SafeAreaView>
      <Pressable
        style={{ width: "100%", height: undefined, aspectRatio: 1 }}
        className="border-dashed border-red-200 border-8 w-full p-8 flex align-middle flex-col justify-center justify-items-center content-center"
        disabled={!canPress}
        onPress={() => {
          pressFun();
        }}
      >
        <View
          className=" flex items-center  justify-center"
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}
        >
          <Image source={src} style={{ width: "100%", height: "100%" }}></Image>
        </View>
      </Pressable>
      <ChoosePicDrawer actionSheetRef={actionSheetRef} tarFun={tarFun} />
    </SafeAreaView>
  );
};

export default UploadPic;
