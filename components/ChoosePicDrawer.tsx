import React, { useState } from "react";
import { Dimensions, Pressable, SafeAreaView, Text } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
function ChoosePicDrawer({
  actionSheetRef,
  tarFun,
}: {
  actionSheetRef: React.RefObject<ActionSheetRef>;
  tarFun: Function;
}): React.JSX.Element {
  const hh = Dimensions.get("window").height;

  return (
    <SafeAreaView>
      <ActionSheet ref={actionSheetRef}>
        <Pressable
          style={{ height: hh * 0.1 }}
          onPress={async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
            tarFun({
              uri: result.assets![0].uri!,
              name: result.assets![0].fileName!,
              type: result.assets![0].mimeType!,
            });
          }}
        >
          <Text
            className=" text-xl font-bold border-b border-gray-200 mx-2"
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              height: "100%",
            }}
          >
            開啟相機
          </Text>
        </Pressable>
        <Pressable
          style={{ height: hh * 0.1 }}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              // allowsEditing: true,
              // aspect: [4, 3],
              quality: 1,
            });
            tarFun({
              uri: result.assets![0].uri!,
              name: result.assets![0].fileName!,
              type: result.assets![0].mimeType!,
            });
          }}
        >
          <Text
            className="  text-xl font-bold  mx-2"
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              height: "100%",
            }}
          >
            開啟相簿
          </Text>
        </Pressable>
      </ActionSheet>
    </SafeAreaView>
  );
}

export default ChoosePicDrawer;
