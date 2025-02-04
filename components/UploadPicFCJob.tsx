import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View, Text } from "react-native";
import { ImgT, imgUrl } from "../types/ImgT";
import plus from "../asset/plus.png";
import ChoosePicDrawer from "./ChoosePicDrawer";
import { ActionSheetRef } from "react-native-actions-sheet";
import { Image } from "expo-image";
import ShowMeMorePic from "./ShowMeMorePic";
const UploadPicFCJob = ({ src }: { src: null | imgUrl }): React.JSX.Element => {
  useEffect(() => {
    // console.log(src);
  }, []);

  const [visible, setVisible] = useState<boolean>(false);

  const hideModal = () => {
    setVisible(false);
  };

  if (!src) {
    return (
      <SafeAreaView>
        <Text allowFontScaling={false} className="dark:text-white">何不催促他快點完成工作ㄋ</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Pressable
        style={{ width: "100%", height: undefined, aspectRatio: 1 }}
        className="  w-full p-8 flex align-middle flex-col justify-center justify-items-center content-center"
        onPress={() => {
          setVisible(true);
        }}
      >
        <View
          className=" flex items-center  justify-center"
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}
        >
          <Image source={src} style={{ width: "85%", height: "85%" }}></Image>
        </View>
      </Pressable>
      <ShowMeMorePic visible={visible} hideModal={hideModal}>
        <View>
          <Image source={src} style={{ width: "100%", height: "100%" }}></Image>
        </View>
      </ShowMeMorePic>
    </SafeAreaView>
  );
};

export default UploadPicFCJob;
