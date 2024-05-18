import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { login } from "../util/loginInfo";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../App";
import { callAPI } from "../util/callAPIUtil";

function Login(): React.JSX.Element {
  const [secure, setSecure] = useState(true);
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");

  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const ww = Dimensions.get("window").width;

  const handleLogin = async () => {
    try {
      // save user data
      const result = await callAPI(
        "/api/auth",
        "POST",
        { phoneNum: phoneNum, pwd: password },
        false
      );

      if (result.ok == false) throw new Error("http not ok");

      const res = await result.json();

      await login({ jwtToken: res.Token });

      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
      if (err instanceof TypeError) {
        if (err.message == "Network request failed") {
          Alert.alert("糟糕！", "請檢察網路有沒有開", [
            { text: "OK", onPress: () => {} },
          ]);
        } else {
          console.log(err);
          Alert.alert("糟糕！", "查無相關帳號資訊，請聯絡相關人員協助確認", [
            { text: "OK", onPress: () => {} },
          ]);
        }
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
            style={styles.input}
            label="電話號碼"
            mode="outlined"
            onChangeText={(e) => {
              setPhoneNum(e);
            }}
          />

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(e) => {
              setPassword(e);
            }}
            right={
              <TextInput.Icon icon="eye" onPress={() => setSecure(!secure)} />
            }
            label="密碼"
            mode="outlined"
            secureTextEntry={secure}
          />
          <Pressable
            className="mt-4 rounded-lg bg-blue-400 h-10"
            onPress={async () => {
              await handleLogin();
            }}
          >
            <Text
              className="color-white text-2xl"
              style={{ textAlign: "center", textAlignVertical: "center" }}
            >
              登入
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
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Login;
