import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  View,
} from "react-native";
import UploadPic from "./UploadPic";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ImgT, imgUrl } from "../types/ImgT";
import { useAtom } from "jotai";
import { userInfo } from "../page/Home";
import {
  GIBEDEIMGB0SS,
  GIBEDETYPEB0SS,
  GIBEDEURLB0SS,
  callAPI,
  callAPIForm,
} from "../util/callAPIUtil";

function DriverPic({ showOption }: { showOption: boolean }): React.JSX.Element {
  useEffect(() => {
    const getData = async () => {
      try {
        if (getUserInfo?.Trucklicense?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Trucklicense!.String}`
          );
          setTruckLicense(src);
        }
        if (getUserInfo?.Driverlicense?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Driverlicense!.String}`
          );
          setDriverLicense(src);
        }
        if (getUserInfo?.Insurances?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Insurances!.String}`
          );
          setInsurances(src);
        }
        if (getUserInfo?.Registration?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Registration!.String}`
          );
          setRegistration(src);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const ww = Dimensions.get("window").width;

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const [canPress, setCanPress] = useState<boolean>(false);
  const actionSheetRef1 = useRef<ActionSheetRef>(null);
  const actionSheetRef2 = useRef<ActionSheetRef>(null);
  const actionSheetRef3 = useRef<ActionSheetRef>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [insurances, setInsurances] = useState<ImgT | imgUrl>();
  const [registration, setRegistration] = useState<ImgT | imgUrl>();
  const [driverLicense, setDriverLicense] = useState<ImgT | imgUrl>();
  const [truckLicense, setTruckLicense] = useState<ImgT | imgUrl>();

  const pressFun = () => {
    actionSheetRef.current?.show();
  };
  const pressFun1 = () => {
    actionSheetRef1.current?.show();
  };
  const pressFun2 = () => {
    actionSheetRef2.current?.show();
  };
  const pressFun3 = () => {
    actionSheetRef3.current?.show();
  };

  return (
    <SafeAreaView>
      {showOption ? (
        <Pressable
          className=" border border-purple-400 bg-purple-300 rounded-xl py-1"
          onPress={() => {
            setCanPress(!canPress);
          }}
        >
          {canPress ? "取消" : "編輯"}
        </Pressable>
      ) : (
        <></>
      )}

      <View className="flex flex-col ">
        <View className="flex flex-row justify-around my-3">
          <UploadPic
            showOption={showOption}
            pressFun={pressFun1}
            canPress={canPress}
            src={truckLicense!}
            actionSheetRef={actionSheetRef1}
            tarFun={setTruckLicense}
            showText="拖車照"
          />
          <UploadPic
            showOption={showOption}
            pressFun={pressFun2}
            canPress={canPress}
            src={registration!}
            actionSheetRef={actionSheetRef2}
            tarFun={setRegistration}
            showText="行照"
          />
        </View>
        <View className="flex flex-row justify-around my-3">
          <UploadPic
            showOption={showOption}
            pressFun={pressFun3}
            canPress={canPress}
            src={driverLicense!}
            actionSheetRef={actionSheetRef3}
            tarFun={setDriverLicense}
            showText="駕照"
          />
          <UploadPic
            showOption={showOption}
            pressFun={pressFun}
            canPress={canPress}
            src={insurances!}
            actionSheetRef={actionSheetRef}
            tarFun={setInsurances}
            showText="保單"
          />
        </View>
      </View>
      {canPress ? (
        <Pressable
          className=" border border-purple-400 bg-purple-300 rounded-xl py-1"
          onPress={async () => {
            const f = new FormData();

            if (truckLicense && !("headers" in truckLicense)) {
              f.append("TruckLicense", truckLicense!);
            }

            if (driverLicense && !("headers" in driverLicense!)) {
              f.append("DriverLicense", driverLicense!);
            }

            if (insurances && !("headers" in insurances!)) {
              f.append("Insurances", insurances!);
            }
            console.log("TrYd");

            if (registration && !("headers" in registration!)) {
              f.append("Registration", registration!);
            }
            try {
              const res = await callAPIForm(
                "/api/user/UpdateDriverPic",
                "POST",
                f,
                true
              );
              Alert.alert("完成", "管理員將確認您的資料", [{ text: "ok" }]);
            } catch (error) {
              Alert.alert("糟糕", "好像出錯了...", [{ text: "ok" }]);
              console.log(error);
            }
          }}
        >
          儲存
        </Pressable>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

export default DriverPic;
