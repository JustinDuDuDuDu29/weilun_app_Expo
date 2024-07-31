import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import * as Linking from "expo-linking";
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
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  return (
    <SafeAreaView>
      <ActionSheet ref={actionSheetRef}>
        <Pressable
          style={{ height: hh * 0.1 }}
          onPress={async () => {
            if (cameraStatus) {
              if (
                cameraStatus.status ===
                  ImagePicker.PermissionStatus.UNDETERMINED ||
                (cameraStatus.status === ImagePicker.PermissionStatus.DENIED &&
                  cameraStatus.canAskAgain)
              ) {
                const permission = await requestCameraPermission();
                if (permission.granted) {
                }
              } else if (
                cameraStatus.status === ImagePicker.PermissionStatus.DENIED
              ) {
                await Linking.openSettings();
              } else {
              }
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
            tarFun({
              uri: result.assets![0].uri!,
              name: result.assets![0].fileName!,

              type:
                Platform.OS === "android"
                  ? result.assets![0].mimeType!
                  : result.assets![0].type,
            });
          }}
        >
          <View className="flex h-full justify-center items-center">
            <Text
              className=" text-xl font-bold border-b border-gray-200 mx-2"
              // style={{
              //   textAlign: "center",
              //   textAlignVertical: "center",
              //   height: "100%",
              // }}
            >
              開啟相機
            </Text>
          </View>
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
            const obj = {
              uri: result.assets![0].uri!,
              name: result.assets![0].fileName!,
              type:
                Platform.OS === "android"
                  ? result.assets![0].mimeType!
                  : result.assets![0].type!,
            };
            tarFun(obj);
            console.log(obj);
          }}
        >
          <View className="flex h-full justify-center items-center">
            <Text
              className="  text-xl font-bold  mx-2"
              style={
                {
                  // textAlign: "center",
                  // textAlignVertical: "center",
                  // height: "100%",
                }
              }
            >
              開啟相簿
            </Text>
          </View>
        </Pressable>
      </ActionSheet>
    </SafeAreaView>
  );
}

export default ChoosePicDrawer;
