import { NullDate } from "./userT";

export type alertT={
    ID: number;
    Cmpname: string;
    Cmpid: number;
    Alert: string;
    Createdate: string;
    Deletedate: NullDate;
}

export type newAlertT={
    belongCmp: number;
    alert: string;
}