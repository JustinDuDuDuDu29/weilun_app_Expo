// type ScreenProp = NativeStackNavigationProp<RootStackParamList>;
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {jobItemT} from './jobItemT';

export type ScreenProp = NativeStackNavigationProp<RootStackParamList>;


export type RootStackParamList = {
    homeP: undefined;
    jobsP: undefined;
    loginP: undefined;
    registerP: undefined;
    jobDetailP: {jobItem: jobItemT};
    turnOverP: undefined;
    accountInfoP: undefined;
    customerSP: undefined;
    mainTainP: undefined;
    finishJobP: undefined;
    userInfoP:undefined;
    changePasswordP:undefined;
};
