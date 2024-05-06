import { NullString } from "./JobItemT";

export type NewUser={
  Name: string;
  Role: string;
  PhoneNum:string;
  BelongCmp: number;
  driverInfo?: {
      percentage: number;
      nationalIdNumber: string;
  }
}

export type cmpInfo={
  CreateDate: string;
  DeletedDate: NullDate;
  ID: number;
  LastModifiedDate: string;
  Name: string;
}

export type inUserT={
  ApprovedDate:NullDate; 
  Belongcmp: number;
  DeletedDate: NullDate; 
  Driverlicense?: NullString;
  ID: number; 
  Initpwdchanged: boolean; 
  Insurances?: NullString; 
  Lastalert?: NullInt64;
  Username: string; 
  Cmpname: string; 
  Nationalidnumber?: string;
  Percentage?: number;
  Phonenum: string; 
  Registration?: NullString; 
  Role: number; 
  Trucklicense?: NullString;
}

export type NullInt64={
  Int64: number;
  Valid: boolean;
}
export type NullDate = {
  Time: string;
  Valid: boolean;
}