import React, { useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {MD2Colors, PaperProvider} from 'react-native-paper';
import Login from './page/Login';
import Home from './page/Home';
import CustomerS from './page/CustomerS';
import Jobs from './page/Jobs';
import {atom, useAtom} from 'jotai';
import {isLoggedIn} from './util/loginInfo';
import {ActivityIndicator, View} from 'react-native';
import TurnOver from './page/TurnOver';
import Maintain from './page/Maintain';
import FinishJob from './page/FinishJob';
import UserInfo from './page/UserInfo';
import ChangePassword from './page/ChangePassword';
import "./global.css"
import UserManageP from './page/UserManageP';
import JobsAdmin from './page/JobsAdmin';
import JobUpdateP from './page/JobUpdateP';
import AlertP from './page/AlertP';
import { io } from "socket.io-client";
import { socket } from './util/sio';

export const isLoggedInAtom = atom(false);

const Stack = createNativeStackNavigator();

function SplashScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator animating={true} color={MD2Colors.red800} />
    </View>
  );
}


function App() {
  const [loginState, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');



  useEffect(() => {
    const fun = async () => {
      try {
        setIsLoggedIn(await isLoggedIn());
        setIsLoading(false);
      } catch (error) {
        console.log('err: ', error);
      }
    };
    fun();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <PaperProvider theme={{}}>
      <NavigationContainer>
        <Stack.Navigator>
          {loginState ? (
            <>
              <Stack.Screen name="homeP" component={Home} />
              <Stack.Screen name="jobsP" component={Jobs} />
              <Stack.Screen name="customerSP" component={CustomerS} />
              <Stack.Screen name="finishJobP" component={FinishJob} />
              <Stack.Screen name="turnOverP" component={TurnOver} />
              <Stack.Screen name="mainTainP" component={Maintain} />
              <Stack.Screen name="userInfoP" component={UserInfo} />
              <Stack.Screen name="changePasswordP" component={ChangePassword} />
              <Stack.Screen name="jobsAdminP" component={JobsAdmin} />
              <Stack.Screen name="jobUpdateP" component={JobUpdateP} />
              <Stack.Screen name="userManageP" component={UserManageP} />
              <Stack.Screen name="alertP" component={AlertP} />
            </>
          ) : (
            <>
              <Stack.Screen name="loginP" component={Login} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;