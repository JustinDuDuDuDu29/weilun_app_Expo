import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import {jobItemT} from '../types/jobItemT';
import {Icon} from 'react-native-paper';
import {useAtom} from 'jotai';
import {pendingJob, userInfo} from '../page/Home';
import {callAPI} from '../util/callAPIUtil';

function JobBlock({jobItem}: {jobItem: jobItemT}): React.JSX.Element {
  const ww = Dimensions.get('window').width;
  const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  return (
    <SafeAreaView>
      <Pressable
        // style={{
        //   backgroundColor:
        //     getPendingJob!.ID == jobItem.ID
        //       ? 'rgb(254 249 195)'
        //       : 'rgb(167 243 208)',
        // }}
        className="bg-green-300 my-3 rounded-2xl w-full flex flex-row justify-center content-center"
        onPress={async () => {
          // driver press to claim job
          if (getUserInfo?.Role == 300) {
            try {
              const res = await callAPI(
                `/api/claimed/${jobItem.ID}`,
                'POST',
                {},
                true,
              );

              if (res.status == 409) {
                Alert.alert(
                  '不能貪心喔～',
                  '你已經有一項進行中的工作，請先取消或完成該作業',
                  [
                    {
                      text: 'OK',
                    },
                  ],
                );
              }
            } catch (error) {
              console.log(error);
            }
          }
        }}>
        <View
          style={{flex: 0.3, flexBasis: 0.3}}
          className="flex justify-center content-center">
          <Text style={{textAlign: 'center'}} className="text-3xl">
            {jobItem.FromLoc}
          </Text>
        </View>

        <View
          style={{flex: 0.3, flexBasis: 0.3}}
          className="flex justify-center items-center content-center">
          <Icon source="arrow-right-bold" size={ww * 0.25} />
        </View>
        <View
          style={{flex: 0.3, flexBasis: 0.3}}
          className="flex justify-center content-center">
          <Text style={{textAlign: 'center'}} className="text-3xl">
            {jobItem.ToLoc}
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default JobBlock;
