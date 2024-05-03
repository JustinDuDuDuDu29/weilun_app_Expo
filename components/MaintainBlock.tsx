import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import {Icon, Text} from 'react-native-paper';
import {mInfoT, maintainInfoT} from '../types/maintainT';

function MaintainBlock({
  maintainInfo,
}: {
  maintainInfo: maintainInfoT;
}): React.JSX.Element {
  const [isPressed, setIsPressed] = useState(false);

  const ww = Dimensions.get('window').width;
  const wh = Dimensions.get('window').height;

  let displayConcat = '';
  let totalPrice = 0;

  const concatData = (el: mInfoT, index: number, arr: mInfoT[]) => {
    displayConcat += el.name;
    totalPrice += el.price!;
    if (!(index === arr.length - 1)) {
      displayConcat += '、';
    }
  };
  maintainInfo.info.forEach(concatData);

  return (
    <SafeAreaView>
      <Pressable
        onPress={() => {
          // expain the block
          if (isPressed) {
            setIsPressed(!isPressed);
          }

          setIsPressed(!isPressed);
        }}>
        <View
          className="flex flex-row py-2 px-4 my-1 rounded-xl  bg-blue-200"
          style={{height: wh * (isPressed ? 0.45 : 0.12222)}}>
          <View
            style={{flex: 0.15, flexBasis: 0.15}}
            className="flex justify-center content-center">
            <Icon
              source={maintainInfo.type === 'gas' ? 'gas-station' : 'engine'}
              size={ww * 0.11}
            />
          </View>
          <View
            className="flex flex-col justify-between py-3"
            style={{flex: 0.85, flexBasis: 0.85}}>
            {isPressed ? (
              <>
                <View>
                  <View className="flex flex-row">
                    <Text
                      style={{
                        flex: 1 / 3,
                        flexBasis: 1 / 3,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      品名
                    </Text>
                    <Text
                      style={{
                        flex: 1 / 3,
                        flexBasis: 1 / 3,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      數量
                    </Text>
                    <Text
                      style={{
                        flex: 1 / 3,
                        flexBasis: 1 / 3,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}>
                      總價
                    </Text>
                  </View>
                  <FlatList
                    data={maintainInfo.info}
                    renderItem={({item}) => {
                      return (
                        <View className="flex flex-row">
                          <Text
                            style={{
                              flex: 1 / 3,
                              flexBasis: 1 / 3,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              flex: 1 / 3,
                              flexBasis: 1 / 3,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                            }}>
                            {item.quantity}
                          </Text>
                          <Text
                            style={{
                              flex: 1 / 3,
                              flexBasis: 1 / 3,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                            }}>
                            {item.price}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <View>
                  <Text>{displayConcat}</Text>
                </View>
              </>
            )}

            <View>
              {isPressed ? (
                <>
                  <Text>姓名:{maintainInfo.name}</Text>
                  <Text>車牌:{maintainInfo.plateNum}</Text>
                  <Text>日期:{maintainInfo.date}</Text>
                </>
              ) : (
                <></>
              )}
              <Text>維修總價:{totalPrice}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

export default MaintainBlock;
