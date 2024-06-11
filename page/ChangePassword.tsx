import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { callAPI } from "../util/callAPIUtil";
import { useAtom, useStore } from "jotai";
// import { userInfo } from "./Home";
import { logout } from "../util/loginInfo";
import { fnAtom, isLoggedInAtom, userInfo } from "../App";
import { AlertMe } from "../util/AlertMe";

function ChangePassword(): React.JSX.Element {
  const [oldPassword, setOldPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [passwordA, setPasswordA] = useState("");
  const [secure2, setSecure2] = useState(true);
  // const [getUserInfo, setUserInfo] = useAtom(userInfo);
  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const store = useStore();
  const setPwd = async () => {
    if (newPassword != passwordA) {
      Alert.alert("糟糕！", "新密碼不相符！", [{ text: "OK" }]);
    }
    try {
      const res = await callAPI(
        "/api/user/pwd",
        "POST",
        {
          id: store.get(fnAtom).getUserInfofn().ID,
          pwd: newPassword,
          oldPwd: oldPassword,
        },
        true
      );
      if (!res.ok) {
        throw res;
      }

      Alert.alert("成功", "成功修改密碼，即將登出！", [
        {
          text: "OK",
          onPress: async () => {
            store.get(fnAtom).logoutfn();
          },
        },
      ]);
    } catch (err) {
      if (err instanceof Response) {
        switch (err.status) {
          case 451:
            store.get(fnAtom).codefn();
            break;
          case 406:
            Alert.alert("糟糕！", "舊密碼似乎不對唷～", [{ text: "OK" }]);
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
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      >
        <View style={styles.form}>
          <TextInput
            value={oldPassword}
            onChangeText={(e) => {
              setOldPassword(e);
            }}
            right={
              <TextInput.Icon icon="eye" onPress={() => setSecure(!secure)} />
            }
            label="舊密碼"
            mode="outlined"
            secureTextEntry={secure}
          />
          <TextInput
            value={newPassword}
            onChangeText={(e) => {
              setNewPassword(e);
            }}
            right={
              <TextInput.Icon icon="eye" onPress={() => setSecure1(!secure1)} />
            }
            label="新密碼"
            mode="outlined"
            secureTextEntry={secure1}
          />
          <TextInput
            value={passwordA}
            onChangeText={(e) => {
              setPasswordA(e);
            }}
            right={
              <TextInput.Icon icon="eye" onPress={() => setSecure2(!secure2)} />
            }
            label="再次輸入新密碼"
            mode="outlined"
            secureTextEntry={secure2}
          />
          <Pressable
            className=" border border-purple-400 bg-purple-300 rounded-xl py-1 my-2"
            onPress={async () => {
              await setPwd();
            }}
          >
            <Text
              className="text-xl text-stone-800"
              style={{ verticalAlign: "middle", textAlign: "center" }}
            >
              送出
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderRadius: 5,
  },
});
export default ChangePassword;
