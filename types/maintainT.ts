export type mInfoT = {id: string|null, name: string|null, price: number|null, quantity: number|null}

export type maintainInfoT = {
    "id": number;
    "type": string;
    "info": mInfoT[];
    "name": string;
    "plateNum": string;
    "date": string;
    "place": string;
};

