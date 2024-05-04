// import {process.env.EXPO_PUBLIC_HOST} from '@env';
import { getSecureValue } from './loginInfo';
 

export async function callAPI(route: string, method: string, body:object, useAuth:boolean) {
    const bearer = "Bearer "+ (await getSecureValue("jwtToken")).toString()
    return await fetch(process.env.EXPO_PUBLIC_HOST+route, {
        headers:{
            'Authorization': (useAuth?bearer:""),
        },
        method:method,
        body:method == "POST"?(JSON.stringify({...body})):null
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