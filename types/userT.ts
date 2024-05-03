import { NullString } from "./jobItemT";


// export type userT ={
//     id: number;
//     userName: string;
//     role: number;
//     phoneNum:string;
//     belongCmp: number;
//     cmpName: string;
//     Initpwdchanged:boolean;
//     nationalIDNumber?:string;
//     truckLicense?:NullString;
//     registration?:NullString;
//     driverLicense?:NullString;
//     Insurances?:NullString;
//     approvedDate?:NullDate;
//     Percentage?: number;
//   }
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
  String: string;
  Valid: boolean;
}