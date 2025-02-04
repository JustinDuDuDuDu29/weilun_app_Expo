import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  View,
  Text,
  Platform,
} from "react-native";
import UploadPic from "./UploadPic";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ImgT, imgUrl } from "../types/ImgT";
import { useAtom, useStore } from "jotai";
import { GIBEDEIMGB0SS, callAPIForm } from "../util/callAPIUtil";
import { fnAtom, userInfo } from "../App";
import * as FileSystem from "expo-file-system";
function DriverPic({ showOption }: { showOption: boolean }): React.JSX.Element {
  const store = useStore();

  useEffect(() => {
    const getData = async () => {
      try {
        if (store.get(fnAtom).getUserInfofn()?.Trucklicense?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${
              store.get(fnAtom).getUserInfofn()!.Trucklicense!.String
            }`
          );
          setTruckLicense(src);
        }
        if (store.get(fnAtom).getUserInfofn()?.Driverlicense?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${
              store.get(fnAtom).getUserInfofn()!.Driverlicense!.String
            }`
          );
          setDriverLicense(src);
        }
        if (store.get(fnAtom).getUserInfofn()?.Insurances?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${
              store.get(fnAtom).getUserInfofn()!.Insurances!.String
            }`
          );
          setInsurances(src);
        }
        if (store.get(fnAtom).getUserInfofn()?.Registration?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${
              store.get(fnAtom).getUserInfofn()!.Registration!.String
            }`
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

  // const [getUserInfo, setUserInfo] = useAtom(userInfo);
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
          <Text allowFontScaling={false}            className="text-2xl text-stone-800"
            style={{ verticalAlign: "middle", textAlign: "center" }}
          >
            {canPress ? "取消" : "編輯照片"}
          </Text>
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
            type="small"
          />
          <UploadPic
            type="small"
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
            type="small"
            showOption={showOption}
            pressFun={pressFun3}
            canPress={canPress}
            src={driverLicense!}
            actionSheetRef={actionSheetRef3}
            tarFun={setDriverLicense}
            showText="駕照"
          />
          <UploadPic
            type="small"
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
          className=" border border-purple-400 bg-purple-300 rounded-xl py-1 my-2"
          onPress={async () => {
            const f = new FormData();
            if (truckLicense && !("headers" in truckLicense)) {
              f.append("TruckLicense", {
                name: truckLicense.name,
                uri: truckLicense.uri,
              });
              console.log(truckLicense.uri);
              // f.append("TruckLicense", truckLicense!);
            }

            if (driverLicense && !("headers" in driverLicense!)) {
              f.append("DriverLicense", driverLicense!);
            }

            if (insurances && !("headers" in insurances!)) {
              f.append("Insurances", insurances!);
            }

            if (registration && !("headers" in registration!)) {
              f.append("Registration", registration!);
            }
            console.log(f);
            try {
              console.log("...");

              const res = await callAPIForm(
                "/api/user/UpdateDriverPic",
                "POST",
                f,
                true
              );
              console.log("...2");

              console.log(res.status);
              setCanPress(false);
              Alert.alert("完成", "管理員將確認您的資料", [{ text: "ok" }]);
            } catch (error) {
              Alert.alert("糟糕", "好像出錯了...", [{ text: "ok" }]);
              console.log(error);
            }
          }}
        >
          <Text allowFontScaling={false}            className="text-2xl text-stone-800"
            style={{ textAlign: "center", verticalAlign: "middle" }}
          >
            儲存
          </Text>
        </Pressable>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

export default DriverPic;
