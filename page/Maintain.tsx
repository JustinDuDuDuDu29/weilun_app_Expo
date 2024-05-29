import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  Pressable,
  Alert,
} from "react-native";
import _data from "../asset/fakeData/_maintain.json";
import MaintainBlock from "../components/MaintainBlock";
import { mInfoT, maintainInfoT } from "../types/maintainT";
import { FAB, Icon, RadioButton, Text } from "react-native-paper";
import { StyleSheet } from "nativewind";
import GoodModal from "../components/GoodModal";
import MGas from "../components/MGas";
import SmallModal from "../components/SmallModal";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import giveMeDate from "../util/giveMeDate";
import { callAPI, callAPIForm } from "../util/callAPIUtil";
import { useAtom } from "jotai";
import { userInfo } from "./Home";

function Maintain(): React.JSX.Element {
  const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const getData = useCallback(async () => {
    try {
      const res = await callAPI("/api/repair", "GET", {}, true);

      if (res.status == 200) {
        const data: maintainInfoT[] = await res.json();
        setData(data.res);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getData();
  }, []);

  const [data, setData] = useState<maintainInfoT[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<string>("gas");
  const [gasLiter, setGasLiter] = useState<mInfoT[]>([]);
  const [date, setDate] = useState(new giveMeDate().now_yyyymmdd());

  const [tmpNew, setTmpNew] = useState<mInfoT>({
    id: uuidv4(),
    price: 0,
    quantity: 0,
    name: "92汽油",
  });

  const removeByUUID = (id: string) => {
    setGasLiter(
      gasLiter.filter((el: mInfoT) => {
        return el.id != id;
      })
    );
  };

  const addToGasLiter = () => {
    if (tmpNew.name == "" || tmpNew.price == 0 || tmpNew.quantity == 0) {
      Alert.alert("注意", "好像有東西沒填齊唷", [{ text: "OK" }]);
      return;
    }

    const arr = gasLiter;
    const index = arr.findIndex((el) => {
      return el.id == tmpNew.id;
    });

    if (index >= 0) {
      arr[index] = tmpNew;
    } else {
      arr.push(tmpNew);
    }

    setGasLiter(arr);
    setTmpNew({
      id: uuidv4(),
      price: 0,
      quantity: 0,
      name: "",
    });
    setModalVisible(false);
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSubmit = async () => {
    const f = new FormData();

    if (type === "gas") {
      if (tmpNew.name == "" || tmpNew.price == 0 || tmpNew.quantity == 0) {
        Alert.alert("注意", "好像有東西沒填齊唷", [{ text: "OK" }]);
        return;
      }
      const arr = gasLiter;
      arr.push(tmpNew);
      setGasLiter(arr);
    }
    if (gasLiter.length == 0) {
      setVisible(false);
      setModalVisible(false);
      setGasLiter([]);
      return;
    }

    f.append("repairInfo", JSON.stringify(gasLiter));
    try {
      const res = await callAPIForm(
        `/api/repair?type=${type}`,
        "POST",
        f,
        true
      );

      if (res.status == 200) {
        setVisible(false);
        setModalVisible(false);
        setGasLiter([]);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ww = Dimensions.get("window").width;
  const wh = Dimensions.get("window").height;

  return (
    <SafeAreaView>
      <View className="mx-5 relative">
        <FlatList
          className="h-full"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.ID!.toString()}
          renderItem={({ item }: { item: maintainInfoT }) => (
            <MaintainBlock maintainInfo={item} />
          )}
        />
        {getUserInfo?.Role == 300 && (
          <FAB icon="plus" style={styles.fab} onPress={() => showModal()} />
        )}
      </View>

      <GoodModal visible={visible} hideModal={hideModal}>
        <View className="px-3 py-3">
          <View className="flex flex-col justify-between">
            <Text>請選擇類別：</Text>
            <View className="flex flex-row justify-between">
              <View>
                <RadioButton.Group
                  onValueChange={(newValue) => {
                    setType(newValue);
                    setGasLiter([]);

                    if (newValue == "gas") {
                      setTmpNew({
                        id: uuidv4(),
                        price: 0,
                        quantity: 0,
                        name: "92汽油",
                      });
                      return;
                    }
                    setTmpNew({
                      id: uuidv4(),
                      price: 0,
                      quantity: 0,
                      name: "",
                    });
                  }}
                  value={type}
                >
                  <View className="flex flex-col">
                    <View className="flex flex-row  items-center align-middle">
                      <RadioButton value="gas" />
                      <Text>加油</Text>
                    </View>
                    <View className="flex flex-row  items-center align-middle">
                      <RadioButton value="maintain" />
                      <Text>保養及維修</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
              {type === "gas" ? (
                <></>
              ) : (
                <View className="h-full flex  items-center align-middle content-center justify-center flex-row">
                  <Pressable
                    className="bg-blue-300 flex rounded-full"
                    onPress={(e) => {
                      setTmpNew({
                        id: uuidv4(),
                        price: 0,
                        quantity: 0,
                        name: "",
                      });
                      setModalVisible(true);
                    }}
                  >
                    <Icon source={"plus"} size={ww * 0.15} />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
          <MGas
            type={type}
            tmpNew={tmpNew}
            setTmpNew={setTmpNew}
            removeByUUID={removeByUUID}
            gasLiter={gasLiter}
            setModalVisible={setModalVisible}
          />
          <View className="bg-blue-400 py-3 mt-3 rounded-xl">
            <Pressable
              onPress={async () => {
                // handle sumit
                await handleSubmit();
              }}
            >
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                送出
              </Text>
            </Pressable>
          </View>
          <SmallModal
            tmpNew={tmpNew}
            setTmpNew={setTmpNew}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            addToGasLiter={addToGasLiter}
          />
        </View>
      </GoodModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 40,
  },
});

export default Maintain;
