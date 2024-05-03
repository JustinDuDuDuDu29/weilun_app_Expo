export type jobItemT = {
    ID: number;
    FromLoc: String;
    Mid: NullString;
    ToLoc: String;
    Price?: number;
    Remaining?: number;
    Belongcmp?: number;
    Source?: string;
    Jobdate?: string;
    Memo?: NullString;
    CloseDate?: NullString;
    DeleteDate?: NullString;
};

export type NullString = {
    String: string;
    Valid: boolean;
}