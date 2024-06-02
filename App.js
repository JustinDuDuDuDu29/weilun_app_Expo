import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  MD2Colors,
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
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
import { isLoggedIn } from "./util/loginInfo";
import {
  useColorScheme as usc,
  StatusBar,
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
// import { setBackgroundColorAsync } from 'expo-system-ui';

export const isLoggedInAtom = atom(false);
export const isLoading = atom(false);
export const fnAtom = atom({});

const Stack = createNativeStackNavigator();
colorScheme.set("system");

function App() {
  const myStore = createStore();
  myStore.set(fnAtom, {
    fn: () => {
      console.log("PPP");
    },
  });
  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = React.useState(true);

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

  const { theme } = useMaterial3Theme();

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }
  return (
    <SafeAreaProvider>
    <Provider store={myStore}>

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
              <Stack.Screen name="changePasswordP" component={ChangePassword} />
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
