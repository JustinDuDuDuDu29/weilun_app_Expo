// import {process.env.EXPO_PUBLIC_HOST} from '@env';
import { Alert, Platform, Share } from "react-native";
import { getSecureValue } from "./loginInfo";
// import { Platform } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from "expo-file-system";
// import * as Permissions from 'expo-permissions';
const { StorageAccessFramework } = FileSystem;


const downloadFile = async (uri: string, fileUri: string, bearer: string) => {
  try {
    const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri, {
      headers: {
        Authorization: bearer,
      },
    });

    if (Platform.OS === "android") {
      await saveAndroidFile(downloadedUri, fileUri.split('/').pop() ?? "File");
    } else {
      await Share.share({
        url: downloadedUri,
        message: "請選擇要處理的方式",
      });
    }
  } catch (error: any) {
    console.error(error);
    Alert.alert("下載失敗", error.message || "無法下載檔案");
  }
};

export const download = async (year: string, month: string) => {
  const bearer = "Bearer " + (await getSecureValue("jwtToken")).toString();
  const uri = `${process.env.EXPO_PUBLIC_HOST}/api/revenue/excel?year=${year}&month=${month}`;
  const fileUri = `${FileSystem.documentDirectory}${year}_${month}`;

  await downloadFile(uri, fileUri, bearer);
};

export const downloadSimple = async (year: string, month: string, cmpName: string, cmpid?: number) => {
  const bearer = "Bearer " + (await getSecureValue("jwtToken")).toString();
  const uri = `${process.env.EXPO_PUBLIC_HOST}/api/revenue/simpleExcel?year=${year}&month=${month}&cmpid=${cmpid}`;
  const fileUri = `${FileSystem.documentDirectory}${year}_${month}_${cmpName}月報表`;

  try {
    console.log("Downloading file from URI: ", uri);
    console.log("Saving file to: ", fileUri);

    // Download the file
    const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri, {
      headers: {
        Authorization: bearer,
      },
    });

    console.log("File downloaded to: ", downloadedUri); // Check if the file is downloaded

    // Check if the file exists
    const fileExists = await FileSystem.getInfoAsync(downloadedUri);
    if (!fileExists.exists) {
      throw new Error("File download failed or the file does not exist");
    }

    // Handle file based on platform
    if (Platform.OS === "android") {
      await saveAndroidFile(downloadedUri, fileUri.split('/').pop() ?? "File");
    } else {
      console.log("Sharing file URL:", downloadedUri);
      await Share.share({
        url: downloadedUri,
        message: "請選擇要處理的方式",
      });
    }
  } catch (error: any) {
    console.error("Error in downloadSimple: ", error);
    Alert.alert("下載失敗", error.message || "無法下載檔案");
  }
};

const saveAndroidFile = async (fileUri: string, fileName = "File") => {
  try {
    const fileString = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      throw new Error("未獲得存取權限");
    }

    const fileUriPath = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      fileName + ".xls", // You may want to keep ".xlsx" here if it's an Excel file
      "application/vnd.ms-excel"
    );

    console.log("Saving file to Android path: ", fileUriPath);

    await FileSystem.writeAsStringAsync(fileUriPath, fileString, {
      encoding: FileSystem.EncodingType.Base64,
    });

    alert("成功儲存檔案");
  } catch (error) {
    console.error("Error in saveAndroidFile: ", error);
    Alert.alert("儲存失敗", error.message || "無法儲存檔案");
  }
};

export async function callAPI(
  route: string,
  method: string,
  body: object,
  useAuth: boolean
) {
  const bearer = "Bearer " + (await getSecureValue("jwtToken")).toString();
  // console.log((await getSecureValue("jwtToken")).toString())
  const r = process.env.EXPO_PUBLIC_HOST + route;
  // const res = await fetch("https://www.imdu29.com");
  // if (res.status == 523) {
  //   return;
  // }
  return await fetch(r, {
    headers: {
      Authorization: useAuth ? bearer : "",
    },
    method: method,
    body: method == "GET" ? null : JSON.stringify({ ...body }),
  });
}

export async function callAPIAbort(
  route: string,
  method: string,
  body: object,
  useAuth: boolean,
  signal: AbortSignal
) {
  const bearer = "Bearer " + (await getSecureValue("jwtToken")).toString();
  return await fetch(process.env.EXPO_PUBLIC_HOST + route, {
    signal: signal,
    headers: {
      Authorization: useAuth ? bearer : "",
    },
    method: method,
    body: method == "GET" ? null : JSON.stringify({ ...body }),
  });
}

export async function callAPIForm(
  route: string,
  method: string,
  body: FormData,
  useAuth: boolean
) {
  const bearer = "Bearer " + (await getSecureValue("jwtToken")).toString();
  const r = process.env.EXPO_PUBLIC_HOST + route;

  return await fetch(r, {
    headers: {
      Authorization: useAuth ? bearer : "",
      // 'Content-Type': 'multipart/form-data',
         
    },
    method: method,
    body: body,
  });
}

export async function GIBEDEIMGB0SS(route: string) {
  const bearer = "Bearer " + (await getSecureValue("jwtToken")).toString();

  const ret = {
    uri: process.env.EXPO_PUBLIC_HOST + route,
    headers: { Authorization: bearer },
    method: "GET",
  };
  return ret;
}

export function GIBEDEURLB0SS(route: string): string {
  return process.env.EXPO_PUBLIC_HOST + route;
}
export function GIBEDETYPEB0SS(fileExt: string): string {
  switch (fileExt) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "";
  }
}
