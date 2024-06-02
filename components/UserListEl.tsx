import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { inUserT, userLS, userLSL } from "../types/userT";
import { useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import Dialog from "react-native-dialog";
import { Icon } from "react-native-paper";
import { callAPI } from "../util/callAPIUtil";

export function SmallEL({
  driverInfo,
}: {
  driverInfo: userLSL;
}): React.JSX.Element {
  const navigation = useNavigation<ScreenProp>();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("userInfoAdminP", { uid: driverInfo.id! });
      }}
      className={` rounded-xl my-1 px-3 py-2 ${
        driverInfo.deleted_date
          ? "bg-red-400"
          : driverInfo.Role == 100
          ? "bg-indigo-300"
          : driverInfo?.Role == 200
          ? "bg-pink-300"
          : "bg-lime-200"
      }`}
    >
      <Text>員編：{driverInfo.id}</Text>
      <Text>{driverInfo.Username}</Text>
      <Text>
        職位：
        {driverInfo.Role == 100
          ? "管理員"
          : driverInfo.Role == 200
          ? "公司負責人"
          : "司機"}
      </Text>
      <Text>{driverInfo.phoneNum}</Text>
    </Pressable>
  );
}

function UseListEl({ info }: { info: userLS }): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [dVisible, setDVisible] = useState(false);
  const [newCmpName, setNewCmpName] = useState("");
  const showDialog = () => {
    setDVisible(true);
  };

  const handleCancel = () => {
    setDVisible(false);
  };

  const navigation = useNavigation<ScreenProp>();

  return (
    <SafeAreaView>
      <Pressable
        className={`my-1 rounded-lg px-4 py-2 bg-red-200 flex flex-row justify-between`}
        onPress={() => {
          setVisible(!visible);
        }}
        onLongPress={() => {
          showDialog();
        }}
      >
        <Text>{info.Cmpname}</Text>
        <View className={`${visible ? "rotate-180" : "rotate-90"}`}>
          <Icon source={"triangle"} size={15} />
        </View>
      </Pressable>
      <View>
        {visible ? (
          info.list[0].id ? (
            <FlatList
              data={info.list}
              renderItem={({ item }) => <SmallEL driverInfo={item} />}
              keyExtractor={(item) => item.id!.toString()}
            />
          ) : (
            <Text>他什麼都木有</Text>
          )
        ) : (
          <></>
        )}
      </View>
      <View>
        <Dialog.Container visible={dVisible}>
          <Dialog.Title>更改公司名稱</Dialog.Title>
          <Dialog.Description>賦予它新的稱呼ㄅ</Dialog.Description>
          <Dialog.Input
            onChangeText={(e) => {
              setNewCmpName(e);
            }}
          />
          <Dialog.Button
            label="確定"
            onPress={async () => {
              // console.log(newCmpName);
              await callAPI(
                "/api/cmp",
                "PUT",
                {
                  id: info.cmpid,
                  cmpName: newCmpName,
                },
                true
              );
            }}
          />
          <Dialog.Button
            label="取消"
            onPress={() => {
              handleCancel();
            }}
          />
        </Dialog.Container>
      </View>
    </SafeAreaView>
  );
}

export default UseListEl;
