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