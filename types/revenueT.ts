import { ClaimedJob } from "./JobItemT";

export type revT = {
    Earn: number;
    Count: number;
}

export type cmpJobT = { Count: number; ID: number; Name: string; Total: number; Jobs: ClaimedJob[]}