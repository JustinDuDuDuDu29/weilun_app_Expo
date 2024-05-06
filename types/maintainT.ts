import { NullDate } from "./userT";

export type mInfoT = {
    id:string;
    name: string|null;
    price: number|null;
    quantity: number|null
}

export type maintainInfoT = {
    ID: number;
    Driverid: number;
    Drivername: string;
    type: string;
    Repairinfo: mInfoT[];
    // name: string;
    // plateNum: string;
    Createdate: string;
    Approveddate: NullDate;
    // place: string;
};

