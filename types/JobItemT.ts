import { NullDate } from "./userT";

export type jobItemT = {
    ID: number;
    FromLoc: string;
    Mid: NullString | string;
    ToLoc: string;
    Price: number;
    Remaining: number;
    Belongcmp: number;
    Source: string;
    Jobdate: string;
    Memo: NullString | string;
    CloseDate: NullDate | string;
    DeleteDate: NullDate | string;
};

export type NullString = {
    String: string;
    Valid: boolean;
}

export type ClaimedJob = {
    ID: number;
    Jobid: number;
    Userid: number;
    FromLoc: number;
    Mid: NullString;
    ToLoc: number;
    CreateDate: string;
    Username: string;
    Cmpname: string;
    Finishdate: NullDate,
    Cmpid: number;
    Approveddate: NullDate;
}

export type CJInfo = {
    ID: number,
    Jobid: number,
    Userid: number,
    FromLoc: string,
    Finishdate: NullDate,
    Finishpic: NullString,
    Mid: NullString,
    ToLoc: string,
    CreateDate: string,
    Username: string,
    Cmpname: string,
    Cmpid: number,
    Approveddate: NullDate,
    Driverpercentage: number,
    Percentage:NullInt16,
    Price: number  
}

export type NullInt16 = {
    Int16: number,
    Valid: boolean
}