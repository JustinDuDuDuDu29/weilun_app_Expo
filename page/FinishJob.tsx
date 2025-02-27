import React, { useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Button, Icon } from "react-native-paper";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import plus from "../asset/plus.png";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { callAPI, callAPIForm } from "../util/callAPIUtil";
import { atom, useAtom, useStore } from "jotai";
import { RUEmpty } from "../util/RUEmpty";
import { ImgT } from "../types/ImgT";
import UploadPic from "../components/UploadPic";
import ChoosePicDrawer from "../components/ChoosePicDrawer";
import { ScreenProp } from "../types/navigationT";
import { useNavigation } from "@react-navigation/native";
import { fnAtom, pendingJob } from "../App";

function FinishJob(): React.JSX.Element {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const ww = Dimensions.get("window").width;
  const [finishImg, setFinishImg] = useState<ImgT>();
  // const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const navigation = useNavigation<ScreenProp>();
  const store = useStore();
  const [disable, setDisable] = useState<boolean>(false);
  const finishJobf = async () => {
    setDisable(true);
    try {
      console.log(finishImg);
      if (!RUEmpty(finishImg)) {
        const fd = new FormData();
        // const bb = await (await fetch(finishImg!.uri)).blob();
        fd.append("file", finishImg!);
        const res = await callAPIForm(
          `/api/claimed/finish/${store.get(fnAtom).getPJfn()!.Claimid}`,
          "POST",
          fd,
          true
        );
        console.log(res.status);

        if (res.status == 200) {
          Alert.alert("恭喜", "您已完成這項工作");
          navigation.goBack();
        }
      } else {
        Alert.alert("糟糕！", "請確認是否有正確選擇照片唷～", [{ text: "好" }]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisable(false);
    }
  };

  const pressFun = () => {
    actionSheetRef.current?.show();
  };

  return (
    <SafeAreaView className="flex align-middle flex-col justify-center content-center items-center h-screen">
      <View
        // style={{ width: 0.8 * ww }}
        className="flex flex-col justify-around"
      >
        <UploadPic
          type="big"
          showOption={true}
          showText="完工證明"
          pressFun={pressFun}
          canPress={true}
          src={finishImg!}
          actionSheetRef={actionSheetRef}
          tarFun={setFinishImg}
        />
        <View className="my-5">
          <Pressable
            className="bg-blue-300 rounded-lg py-2"
            disabled={disable}
            onPress={async () => {
              await finishJobf();
            }}
          >
            <Text allowFontScaling={false}              style={{ textAlign: "center", textAlignVertical: "center" }}
              className=" text-2xl font-bold"
            >
              完成工作
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FinishJob;
