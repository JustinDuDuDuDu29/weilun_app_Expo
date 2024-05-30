// import {process.env.EXPO_PUBLIC_HOST} from '@env';
import { getSecureValue } from './loginInfo';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
const { StorageAccessFramework } = FileSystem;
export async function download(year:string, month:string){
    const bearer = "Bearer "+ (await getSecureValue("jwtToken")).toString()

    const uri = process.env.EXPO_PUBLIC_HOST+`/api/revenue/excel?year=${year}&month=${month}`
    let fileUri = FileSystem.documentDirectory + "small.xlsx";
    FileSystem.downloadAsync(uri, fileUri, {
                headers:{
                    'Authorization': bearer,
                }
            })
    .then(async({ uri }) => {
        await saveAndroidFile(uri);
      })
      .catch(error => {
        console.error(error);
      })
}

    const saveAndroidFile = async (fileUri:string, fileName = 'File') => {
        try {
          const fileString = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
          
          const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!permissions.granted) {
            return;
          }
    
          try {
            await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName+".xls", 'application/vnd.ms-excel')
              .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, fileString, { encoding: FileSystem.EncodingType.Base64 });
                alert('Report Downloaded Successfully')
              })
              .catch((e) => {
              });
          } catch (e) {
            throw new Error(e);
          }
    
        } catch (err) {
        }
      }
    


export async function callAPI(route: string, method: string, body:object, useAuth:boolean) {
    const bearer = "Bearer "+ (await getSecureValue("jwtToken")).toString()

    const r = process.env.EXPO_PUBLIC_HOST+route
    return await fetch(r, {
        headers:{
            'Authorization': (useAuth?bearer:""),
        },
        method:method,
        body:method == "GET"?null:(JSON.stringify({...body}))
    })
}

export async function callAPIAbort(route: string, method: string, body:object, useAuth:boolean, signal: AbortSignal) {
    const bearer = "Bearer "+ (await getSecureValue("jwtToken")).toString()
    return await fetch(process.env.EXPO_PUBLIC_HOST+route, {
        signal:signal,
        headers:{
            'Authorization': (useAuth?bearer:""),
        },
        method:method,
        body:method == "GET"?null:(JSON.stringify({...body}))
    })
}

export async function callAPIForm(route: string, method: string, body:FormData, useAuth:boolean) {
    const bearer = "Bearer "+ (await getSecureValue("jwtToken")).toString()
    return await fetch(process.env.EXPO_PUBLIC_HOST+route, {
        headers:{
            'Authorization': (useAuth?bearer:""),
            // 'Content-Type': 'multipart/form-data',
        },
        method:method,
        body:body
    })
}

export async function GIBEDEIMGB0SS(route: string) {
    const bearer = "Bearer "+ (await getSecureValue("jwtToken")).toString()
 
    const ret = { 
        uri:process.env.EXPO_PUBLIC_HOST+route,
        headers:{"Authorization": bearer},
        method:"GET",
    }
    return ret
}

export  function GIBEDEURLB0SS(route: string):string {
    return process.env.EXPO_PUBLIC_HOST+route
}
export  function GIBEDETYPEB0SS(fileExt: string):string {
    switch (fileExt){
    case  "jpeg":
		return "image/jpeg"
	case"png":
		return "image/png"
    default:
		return ""

    }
}