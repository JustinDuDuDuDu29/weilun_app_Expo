import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { callAPI } from "../util/callAPIUtil";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScreenProp } from "../types/navigationT";
import DriverPic from "../components/DriverPic";
import { Icon } from "react-native-paper";
import { cmpInfo, inUserT } from "../types/userT";
import UserCU from "../components/UserCU";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import UserInfoBasic from "./UserInfoBasic";
import UserInfoJobs from "./UserInfoJobs";
import Maintain from "./Maintain";
import { AlertMe } from "../util/AlertMe";
import { fnAtom } from "../App";
import { useStore } from "jotai";

const renderTabBar = (props) => {
  const layout = useWindowDimensions();
  return (
    <TabBar
      {...props}
      tabStyle={{ width: layout.width / 3 }} //<----This aligns indicator scroll position according to custom tab button width
      scrollEnabled={true}
      indicatorStyle={{ width: layout.width / 3 }} //<---same width as tab button
      renderLabel={({ route, focused, color }) => (
        <View style={{ width: layout.width / 3 }}>
          <Text
            className="text-xl"
            style={{ verticalAlign: "middle", textAlign: "center" }}
          >
            {route.title}
          </Text>
        </View>
      )}
    />
  );
};

function UserInfoAdmin({
  route,
}: {
  route: RouteProp<{ params: { uid: number } }, "params">;
}): React.JSX.Element {
  const store = useStore();
  const [OInfo, setOInfo] = useState<inUserT>();

  const getData = useCallback(async () => {
    try {
      const res = await callAPI(`/api/user/${uid}`, "GET", {}, true);
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();

      setOInfo(data);
    } catch (err) {
      if (err instanceof Response) {
        switch (err.status) {
          case 451:
            store.get(fnAtom).codefn();
            break;

          default:
            AlertMe(err);
            break;
        }
      } else if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        Alert.alert("GG", `怪怪\n${err}`, [{ text: "OK", onPress: () => {} }]);
      }
    }
  }, []);
  const [uid, setUid] = useState(route.params.uid);

  const renderScene = React.useCallback(
    ({ route }) => {
      switch (route.key) {
        case "first":
          return OInfo && <UserInfoBasic OInfo={OInfo} />;

        case "second":
          return <UserInfoJobs uid={uid} />;

        case "third":
          return <Maintain uid={uid} />;

        default:
          return null;
      }
    },
    [OInfo]
  );
  useEffect(() => {
    getData();
    setUid(route.params.uid);
    // console.log(route);
  }, []);
  const navigation = useNavigation<ScreenProp>();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "基本資料" },
    { key: "second", title: "工作" },
    { key: "third", title: "維修" },
  ]);

  return (
    // <SafeAreaView>
    <TabView
      renderTabBar={renderTabBar}
      tabBarPosition="bottom"
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
    />

    //     </SafeAreaView>
  );
}
export default UserInfoAdmin;
