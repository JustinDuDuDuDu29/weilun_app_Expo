import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { callAPI, callAPIAbort } from "../util/callAPIUtil";
import { NewUser, cmpInfo, inUserT, userLS } from "../types/userT";
import UseListEl from "../components/UserListEl";
import { FAB, RadioButton, TextInput } from "react-native-paper";
import GoodModal from "../components/GoodModal";

import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchComp from "../components/SearchComp";

function UserManageP(): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [userList, setUsetList] = useState<userLS[]>([]);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className="flex flex-col relative flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <SearchComp
        setVisible={setVisible}
        setUsetList={setUsetList}
        visible={visible}
        hideModal={hideModal}
        userList={userList}
      />

      {/* <View className="px-3 py-2 flex-1 ">
        <FlatList
          data={userList}
          renderItem={({ item }) => <UseListEl info={item} />}
          keyExtractor={(item) => item.cmpid.toString()}
        />
      </View> */}
      <FAB icon="plus" style={styles.fab} onPress={() => showModal()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 50,
  },
});

export default UserManageP;
