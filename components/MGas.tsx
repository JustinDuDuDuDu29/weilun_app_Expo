import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {mInfoT} from '../types/maintainT';
import {Icon, RadioButton, TextInput} from 'react-native-paper';

function MGas(
  this: any,
  {
    tmpNew,
    setTmpNew,
    type,
    removeByUUID,
    gasLiter,
    setModalVisible,
  }: {
    tmpNew: mInfoT;
    setTmpNew: Function;
    type: string;
    removeByUUID: Function;
    gasLiter: mInfoT[];
    setModalVisible: Function;
  },
): React.JSX.Element {
  const ww = Dimensions.get('window').width;

  const [newInfo, setNewInfo] = useState({name: ''});

  return (
    <>
      {type === 'gas' ? (
        <View>
          <RadioButton.Group
            onValueChange={selected => {
              // setNewInfo({...newInfo, name: selected});
              setTmpNew({...tmpNew, name: selected});
            }}
            value={tmpNew.name!}>
            <View>
              <Text>請選擇種類：</Text>
              <View className="flex flex-col">
                <View className="flex flex-row  items-center align-middle">
                  <RadioButton value="92汽油" />
                  <Text>92汽油</Text>
                </View>

                <View className="flex flex-row  items-center align-middle">
                  <RadioButton value="95汽油" />
                  <Text>95汽油</Text>
                </View>

                <View className="flex flex-row  items-center align-middle">
                  <RadioButton value="98汽油" />
                  <Text>98汽油</Text>
                </View>

                <View className="flex flex-row  items-center align-middle">
                  <RadioButton value="超級柴油" />
                  <Text>超級柴油</Text>
                </View>
              </View>
            </View>
          </RadioButton.Group>

          <View>
            <Text>公升數:</Text>
            <TextInput
              onChangeText={e => {
                setTmpNew({...tmpNew, quantity: parseInt(e)});
              }}
            />
            <Text>總價:</Text>
            <TextInput
              onChangeText={e => {
                setTmpNew({...tmpNew, price: parseInt(e)});
              }}
            />
          </View>
        </View>
      ) : (
        <View className="flex flex-col" style={{maxHeight: 400}}>
          <FlatList
            className=" w-full"
            data={gasLiter}
            scrollEnabled={true}
            extraData={this.state}
            showsHorizontalScrollIndicator
            showsVerticalScrollIndicator
            renderItem={item => {
              return (
                <Pressable className="flex flex-row w-full py-3">
                  <View className="flex flex-row justify-between w-full ">
                    <View className="flex flex-col">
                      <Text className="text-xl">品名：{item.item.name}</Text>
                      <Text className="text-xl">
                        數量：{item.item.quantity}
                      </Text>
                      <Text className="text-xl">總價：{item.item.price}</Text>
                    </View>
                    <View className="flex flex-row items-center ">
                      <Pressable
                        onPress={e => {
                          // edit the item
                          setTmpNew(item.item);
                          setModalVisible(true);
                        }}>
                        <Icon source={'pencil-outline'} size={ww * 0.1} />
                      </Pressable>
                      <Pressable
                        onPress={e => {
                          removeByUUID(item.item.id);
                        }}>
                        <Icon source={'trash-can-outline'} size={ww * 0.1} />
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            keyExtractor={item => item.id!.toString()}
          />
        </View>
      )}
    </>
  );
}

export default MGas;
