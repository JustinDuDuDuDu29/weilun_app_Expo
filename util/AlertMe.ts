import { Alert } from "react-native"

export const AlertMe = (info: Response) =>{
    Alert.alert("GG", `回報一下做什麼事情的時候跳出這個ㄅ3Q\n${info.url}\n${info.status}\n${info.body}`)
    return
}