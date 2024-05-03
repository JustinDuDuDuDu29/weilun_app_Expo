import * as SecureStore from 'expo-secure-store';
import { userInfoT } from '../types/userInfoT';


type SetSecureValue = (key: string, value: string) => Promise<void>
type GetSecureValue = (key: string) => Promise<string | false>
type RemoveSecureValue = (key: string) => Promise<void>

const setSecureValue: SetSecureValue = async (key, value) =>{
    // TODO: if reject??
    await SecureStore.setItemAsync(key, value);
}

export const getSecureValue: GetSecureValue = async (key) => {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    return result
  }
  return false
}

const removeSecureValue: RemoveSecureValue = async(key) =>{
  await SecureStore.deleteItemAsync(key)
}


export const login = async (result:userInfoT) => {
    try{
        const all = [
            setSecureValue("jwtToken", result.jwtToken),
        ]
        const saveUserInfo = await Promise.all(all)
        
    }catch (e: unknown) { // <-- note `e` has explicit `unknown` type
        if (typeof e === "string") {
            e.toUpperCase() // works, `e` narrowed to string
        } else if (e instanceof Error) {
            e.message // works, `e` narrowed to Error
        }
        // ... handle other error types 
        throw new Error("Failed");
        
    }
}


// import * as Keychain from 'react-native-keychain';

export const  logout= async () => {
    try {
        const all = [
            removeSecureValue("jwtToken")
        ]
        const res = await Promise.all(all)
        return true
    }
    catch (err) {
        return false
    }

}

export const isLoggedIn = async () => {
    try {
        const all = [getSecureValue("jwtToken")]
        const res = await Promise.all(all)
        if (!res.includes(false)) {
            return true            
        }
        return false;
    }
    catch (err) {
        return false
    }

}