import instance from "./axios";

export type Pack = {
    ID: number,
    Name: string,
    Levels: PackLevel[],
};

export type PackLevel = {
    ID: number,
    Name: string,
    Creator: string,
    Song: string,
    Rating: number,
    EX: number,
};

export type PackShell = {
    ID: number,
    Name: string,
};

export type PackInfo = {
    total: number,
    limit: number,
    page: number,
    packs: PackShell[],
};

export async function GetPacks(page: number): Promise<PackInfo> {
    const res = await instance.get('/packs', { params: { chunk: 36, page, }});
    return res.data;
};

export async function GetPack(packID: number): Promise<Pack> {
    const res = await instance.get('/pack', { params: { packID }});
    return {...res.data, ID: packID};
}

export async function SearchPacks(name: string): Promise<PackInfo> {
    const res = await instance.get('/packs', { params: { chunk: 5, name, }});
    return res.data;
}