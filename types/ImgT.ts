export type ImgT={
    uri: string;
    name: string;
    type: string;
}

export type imgUrl={
    uri: string;
    headers: {
        Authorization: string;
    };
    method: string;
}