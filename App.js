import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./page/Login";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colorScheme, useColorScheme } from "nativewind";
import Home from "./page/Home";
import CustomerS from "./page/CustomerS";
import Jobs from "./page/Jobs";
import { Provider, atom, createStore, useAtom } from "jotai";
import { isLoggedIn, logout } from "./util/loginInfo";
import {
  useColorScheme as usc,
  StatusBar,
  Alert,
  View,
  Text,
} from "react-native";
import TurnOver from "./page/TurnOver";
import Maintain from "./page/Maintain";
import FinishJob from "./page/FinishJob";
import UserInfo from "./page/UserInfo";
import ChangePassword from "./page/ChangePassword";
import "./global.css";
import UserManageP from "./page/UserManageP";
import JobsAdmin from "./page/JobsAdmin";
import JobUpdateP from "./page/JobUpdateP";
import AlertP from "./page/AlertP";
import AdminClaimedJob from "./page/AdminClaimedJob";
import ClaimJobP from "./page/ClaimJobP";
import MaintainInfo from "./page/MainTainInfo";
import { SplashScreen } from "./components/Aplash";
import UserInfoAdmin from "./page/UserInfoAdmin";
import EditUserInfoP from "./page/EditUserInfoP";
import CreateJobP from "./page/CreateJobP";
import AdminMaintain from "./page/AdminMaintain";

export const isLoggedInAtom = atom(false);
export const isLoading = atom(false);
export const fnAtom = atom({
  codefn: () => {},
  logoutfn: async () => {},
  loginfn: (boo) => {},
  setPJfn: (pj) => {},
  getPJfn: () => {},
  getUserInfofn: () => {},
  setUserInfofn: (uF) => {},
});
export const pendingJob = atom(null);
export const userInfo = atom(null);

const Stack = createNativeStackNavigator();
colorScheme.set("system");

const myStore = createStore();

function App() {
  myStore.set(fnAtom, {
    codefn: (code) => {
      Alert.alert(
        "糟糕！",
        "您本次的登入資訊已無效\n可能是在其他地方登入了，或是個人資料已被修改\n如有需要，請洽管理人員！",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              setIsLoggedIn(false);
              setPendingJob(null);
              setUserInfo(null);
            },
          },
        ]
      );
    },
    logoutfn: async () => {
      await logout();
      setIsLoggedIn(false);
      setPendingJob(null);
      setUserInfo(null);
      console.log(881);
    },
    loginfn: (boo) => {
      setIsLoggedIn(boo);
    },
    setPJfn: (pj) => {
      setPendingJob(pj);
      myStore.set(pendingJob, pj);
      // console.log(myStore.get(pendingJob))
    },
    getPJfn: () => {
      return getPendingJob;
    },
    getUserInfofn: () => {
      return getUserInfo;
    },
    setUserInfofn: (uF) => {
      setUserInfo(uF);
      myStore.set(userInfo, uF);
    },
  });

  myStore.set(pendingJob, null);
  myStore.set(userInfo, null);

  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = React.useState(true);
  const [getPendingJob, setPendingJob] = useAtom(pendingJob);
  const [getUserInfo, setUserInfo] = useAtom(userInfo);

  const cS = usc();

  useEffect(() => {
    const fun = async () => {
      try {
        setIsLoading(true);
        setIsLoggedIn(await isLoggedIn());
        setIsLoading(false);
      } catch (error) {
        console.log("err: ", error);
      }
    };
    fun();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <SafeAreaProvider>
      <Provider store={myStore}>
        {/* <Text>loginState:{JSON.stringify(getUserInfo)}</Text> */}
        <StatusBar
          backgroundColor={cS == "light" ? "#fff" : "#000"}
          barStyle={cS == "light" ? "dark-content" : "light-content"}
        />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: cS == "light" ? "#ffffff" : "#3A3B3C",
              },
            }}
          >
            {loginState ? (
              <>
                <Stack.Screen name="homeP" component={Home} />
                <Stack.Screen name="jobsP" component={Jobs} />
                <Stack.Screen name="customerSP" component={CustomerS} />
                <Stack.Screen name="finishJobP" component={FinishJob} />
                <Stack.Screen name="turnOverP" component={TurnOver} />
                <Stack.Screen name="adminMainTainP" component={AdminMaintain} />
                <Stack.Screen name="mainTainP" component={Maintain} />
                <Stack.Screen name="userInfoP" component={UserInfo} />
                <Stack.Screen
                  name="changePasswordP"
                  component={ChangePassword}
                />
                <Stack.Screen name="jobsAdminP" component={JobsAdmin} />
                <Stack.Screen name="jobUpdateP" component={JobUpdateP} />
                <Stack.Screen name="userManageP" component={UserManageP} />
                <Stack.Screen name="alertP" component={AlertP} />
                <Stack.Screen
                  name="adminClaimedJobP"
                  component={AdminClaimedJob}
                />
                <Stack.Screen name="claimJobP" component={ClaimJobP} />
                <Stack.Screen name="maintainInfoP" component={MaintainInfo} />
                <Stack.Screen name="userInfoAdminP" component={UserInfoAdmin} />
                <Stack.Screen name="editUserInfoP" component={EditUserInfoP} />
                <Stack.Screen name="CreateJobP" component={CreateJobP} />
              </>
            ) : (
              <>
                <Stack.Screen name="loginP" component={Login} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
export default App;
