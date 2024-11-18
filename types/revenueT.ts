import { ClaimedJob } from "./JobItemT";

export type revT = {
    Earn: number;
    Count: number;
}

export type userI = { JobCount: number;  UserName: string; JobTotal: number; GasTotal:number; UserID: number; RepairTotal:number}

export type cmpJobT = { Count: number; ID: number; Name: string; Jobtotal: number; Gastotal:number; Users: userI[];Repairtotal:number }