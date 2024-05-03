import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, SafeAreaView} from 'react-native';
import UploadPic from './UploadPic';
import {ActionSheetRef} from 'react-native-actions-sheet';
import {ImgT, imgUrl} from '../types/ImgT';
import {useAtom} from 'jotai';
import {userInfo} from '../page/Home';
import {
  GIBEDEIMGB0SS,
  GIBEDETYPEB0SS,
  GIBEDEURLB0SS,
  callAPI,
} from '../util/callAPIUtil';
import {Button} from 'react-native-paper';

function DriverPic(): React.JSX.Element {
  useEffect(() => {
    const getData = async () => {
      try {
        if (getUserInfo?.Trucklicense?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Trucklicense!.String}`,
          );
          setTruckLicense(src);
        }
        if (getUserInfo?.Driverlicense?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Driverlicense!.String}`,
          );
          setDriverLicense(src);
        }
        if (getUserInfo?.Insurances?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Insurances!.String}`,
          );
          setInsurances(src);
        }
        if (getUserInfo?.Registration?.Valid) {
          const src = await GIBEDEIMGB0SS(
            `/api/static/img/${getUserInfo!.Registration!.String}`,
          );
          setRegistration(src);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);
  const ww = Dimensions.get('window').width;

  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const [canPress, setCanPress] = useState<boolean>(true);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [insurances, setInsurances] = useState<ImgT | imgUrl>();
  const [registration, setRegistration] = useState<ImgT | imgUrl>();
  const [driverLicense, setDriverLicense] = useState<ImgT | imgUrl>();
  const [truckLicense, setTruckLicense] = useState<ImgT | imgUrl>();

  const pressFun = () => {
    actionSheetRef.current?.show();
  };

  return (
    <SafeAreaView>
      <UploadPic
        pressFun={pressFun}
        canPress={canPress}
        src={truckLicense!}
        actionSheetRef={actionSheetRef}
        tarFun={setTruckLicense}
      />
      <UploadPic
        pressFun={pressFun}
        canPress={canPress}
        src={registration!}
        actionSheetRef={actionSheetRef}
        tarFun={setRegistration}
      />
      <UploadPic
        pressFun={pressFun}
        canPress={canPress}
        src={driverLicense!}
        actionSheetRef={actionSheetRef}
        tarFun={setDriverLicense}
      />
      <UploadPic
        pressFun={pressFun}
        canPress={canPress}
        src={insurances!}
        actionSheetRef={actionSheetRef}
        tarFun={setInsurances}
      />
      <Button
        onPress={() => {
          //   console.log(truckLicense );
          //   if (getUserInfo?.Trucklicense && truckLicense?.headers == undefined) {
          //     console.log('TL have changed');
          //   }
        }}>
        儲存
      </Button>
    </SafeAreaView>
  );
}

export default DriverPic;
