import { NullString } from "./JobItemT";
import { NullDate } from "./userT";

export type mInfoT = {
  id: string;
  name: string | null;
  price: number | null;
  place: string | null;
  quantity: number | null;
};



// export type maintainInfoDT = {
//   ApprovedDate: NullDate;
//   CreateDate: string;
//   Driverid: number;
//   ID: 3;
//   ID_2: 1;
//   Name: "John";
//   Name_2: "cmp1";
//   Pic: { String: ""; Valid: false };
//   Repairinfo: [
//     {
//       id: "fbc6fd71-14e2-449d-915f-45151b06d1fd";
//       name: "pp";
//       price: 2500;
//       quantity: 25;
//     }
//   ];
// };

export type maintainInfoT = {
  ID: number;
  Driverid: number;
  Drivername: string;
  type: string;
  Repairinfo: mInfoT[];
  Cmpname:string;
  // name: string;
  Platenum: string;
  Createdate: string;
  Approveddate: NullDate;
  Place: string;
  Pic:NullString;
};
