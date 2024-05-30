
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { ClaimedJob, jobItemT } from './JobItemT';
import { inUserT } from './userT';
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
    userManageP:undefined;
    jobsAdminP:undefined;
    jobUpdateP: {jobItem: jobItemT};
    alertP: undefined;
    adminClaimedJobP: undefined;
    claimJobP: { claimedJob: number};
    maintainInfoP: { maintainID: number};
    userInfoAdminP: { uid: number};
    editUserInfoP: { OInfo: inUserT};
    CreateJobP: undefined;
};
