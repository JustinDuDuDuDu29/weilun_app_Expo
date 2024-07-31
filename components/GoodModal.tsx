import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme as usc } from "react-native";

function GoodModal({
  children,
  visible,
  hideModal,
}: {
  children: React.JSX.Element;
  visible: boolean;
  hideModal: Function;
}): React.JSX.Element {
  const cS = usc();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      hardwareAccelerated={true}
      visible={visible}
      onRequestClose={() => {
        hideModal();
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          hideModal();
        }}
        className="flex justify-end content-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          flex: 1,
        }}
      >
        {/* <TouchableOpacity
          activeOpacity={1}
          className="w-screen flexXXX justify-endXXX"
        > */}
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          style={styles.container}
        >
          <SafeAreaView>
            <View
              style={{
                maxHeight: wh * 0.8,
                backgroundColor: cS == "light" ? "#fff" : "#3A3B3C",
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                padding: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                // elevation: 5,
              }}
            >
              {children}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
        {/* </TouchableOpacity> */}
      </TouchableOpacity>
    </Modal>
  );
}

const ww = Dimensions.get("window").width;
const wh = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    // bottom: 0,
    // flex: 1,
    // justifyContent: "flex-end",
    // paddingHorizontal: 20,
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
export default GoodModal;
