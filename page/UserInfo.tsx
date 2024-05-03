import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {callAPI} from '../util/callAPIUtil';
import {atom, useAtom} from 'jotai';
import {userInfo} from './Home';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {ScreenProp} from '../types/navigationT';
import DriverPic from '../components/DriverPic';

function UserInfo(): React.JSX.Element {
  useEffect(() => {
    const getUserInfo = async () => {
      try {
      } catch (error) {
        console.log('error: ', error);
      }
    };

    getUserInfo();
  }, []);
  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  const roleName =
    getUserInfo?.Role == 100
      ? '管理員'
      : getUserInfo?.Role == 200
      ? '公司負責人'
      : '司機';

  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>姓名：{getUserInfo?.Username}</Text>
          <Text>電話：{getUserInfo?.Phonenum}</Text>
          <Text>編號：{getUserInfo?.ID}</Text>
          <Text>所屬公司：{getUserInfo?.Cmpname}</Text>
          <Text>類別：{roleName}</Text>
        </View>
        <Button
          onPress={() => {
            navigation.navigate('changePasswordP');
          }}>
          <Text>修改密碼</Text>
        </Button>
        {getUserInfo?.Role == 300 ? <DriverPic /> : <></>}
      </ScrollView>
    </SafeAreaView>
  );
}
export default UserInfo;
