import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function ShowMeMorePic({
  children,
  visible,
  hideModal,
}: {
  children: React.JSX.Element;
  visible: boolean;
  hideModal: Function;
}): React.JSX.Element {
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
        className="flex justify-center content-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          flex: 1,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="w-screen flex justify-center"
        >
          <View style={styles.modalView}>{children}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const ww = Dimensions.get("window").width;
const wh = Dimensions.get("window").height;
const styles = StyleSheet.create({
  modalView: {
    maxHeight: wh * 0.8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default ShowMeMorePic;
