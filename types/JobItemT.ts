import { NullDate } from "./userT";

export type jobItemT = {
  ID: number;
  Fromloc: string;
  Mid: NullString;
  // | string;
  Cmpname:string;
  Toloc: string;
  Price: number;
  Remaining: number;
  Belongcmp: number;
  Source: string;
  Jobdate: string;
  Memo: NullString;
  // CloseDate: NullDate | string;
  // DeleteDate: NullDate | string;
};
export type jobItemTS = {
  Fromloc: string;
  Mid: string;
  Toloc: string;
  Price: number;
  Remaining: number;
  Belongcmp: number;
  Source: string;
  Jobdate: string;
  Memo: string;
};

export type currentJob = {
  Claimid: number;
  Claimdate: string;
  FromLoc: string;
  Mid: NullString;
  ToLoc: string;
  Price: number;
  Source: string;
  Memo: NullString;
  ID: number;
};

export type NullString = {
  String: string;
  Valid: boolean;
};

export type userJob=      {
  userID: number,
  userName: string
}

export type PendingJobUserCmp =    {
  cmpID: number,
  cmpName: string,
  users: ClaimedJob[]
}

export type ClaimedJob = {
  ID: number;
  Jobid: number;
  Userid: number;
  fromloc: string;
  mid: NullString | null;
  toloc: string;
  CreateDate: string;
  Username: string;
  Cmpname: string;
  Finishdate: NullDate | null;
  Cmpid: number;
  Approveddate: NullDate | null;
};

// export type uinfojobT = {
//     Approveddate: NullDate;
//     Cmpid: number;
//     Cmpname: string;
//     CreateDate: string;
//     Finishdate: NullDate;
//     FromLoc: string;
//     ID: number;
//     Jobid: number;
//     Mid: NullString;
//     ToLoc: string;
//     Userid: number;
//     Username: string;
//   };
export type CJInfo = {
  ID: number;
  Jobid: number;
  Userid: number;
  FromLoc: string;
  Finishdate: NullDate;
  Finishpic: NullString;
  Mid: NullString;
  ToLoc: string;
  CreateDate: string;
  Username: string;
  Cmpname: string;
  Cmpid: number;
  Approveddate: NullDate;
  // Driverpercentage: number,
  // Percentage:NullInt32,
  Price: number;
};


export type NullInt16 = {
  Int16: number;
  Valid: boolean;
};
export type NullInt32 = {
  Int32: number;
  Valid: boolean;
};
