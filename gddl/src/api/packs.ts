import StorageManager from "../utils/storageManager";
import instance from "./axios";

export type Pack = {
    ID: number,
    Name: string,
    Levels: PackLevel[],
};

export type PackLevel = {
    LevelID: number,
    Name: string,
    Creator: string,
    Song: string,
    Rating: number,
    Enjoyment: number,
    Difficulty: string,
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

export async function CreatePacks(name: string, description: string): Promise<void> {
    const csrfToken = StorageManager.getCSRF();

    return await instance.post('/packs/create', { name, description }, { withCredentials: true, params: { csrfToken }});
}

export function AddLevelToPack(packID: number, levelID: number) {
    const csrfToken = StorageManager.getCSRF();

    return instance.post('/packs/edit/add', { packID, levelID }, { withCredentials: true, params: { csrfToken }});
}

export function RemoveLevelFromPack(packID: number, levelID: number) {
    const csrfToken = StorageManager.getCSRF();

    return instance.post('/packs/edit/remove', { packID, levelID }, { withCredentials: true, params: { csrfToken }});
}