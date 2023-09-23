import StorageManager from "../utils/storageManager";
import APIClient from "./axios";

export type Pack = {
    ID: number,
    Name: string,
    Description: string,
    IconName: string,
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
    CategoryID: number,
    Name: string,
    IconName: string,
};

export interface CategoryResponse {
    ID: number
    Name: string
    Description: string
}

export type PackInfo = {
    total: number
    limit: number
    page: number
    packs: PackShell[]
    categories: CategoryResponse[]
};

export async function GetPacks(page: number): Promise<PackInfo> {
    const res = await APIClient.get('/packs', { params: { chunk: 100, page, }});
    return res.data;
};

export async function GetPack(packID: number): Promise<Pack> {
    const res = await APIClient.get('/pack', { params: { packID }});
    return {...res.data, ID: packID};
}

export async function SearchPacks(name: string): Promise<PackInfo> {
    const res = await APIClient.get('/packs', { params: { chunk: 5, name, }});
    return res.data;
}

export async function CreatePacks(name: string, description: string): Promise<void> {
    const csrfToken = StorageManager.getCSRF();

    return await APIClient.post('/packs/create', { name, description }, { withCredentials: true, params: { csrfToken }});
}

export function AddLevelToPack(packID: number, levelID: number, isEX: boolean) {
    const csrfToken = StorageManager.getCSRF();

    return APIClient.post('/packs/edit', { packID, levelID, isEX }, { withCredentials: true, params: { csrfToken }});
}

export function RemoveLevelFromPack(packID: number, levelID: number) {
    const csrfToken = StorageManager.getCSRF();

    return APIClient.delete('/packs/edit', { withCredentials: true, params: { csrfToken, packID, levelID }});
}

export interface Leader {
    UserID: number,
    Name: string,
    Sum: number,
    AccentColor: number,
    DiscordID: string,
    Avatar: string,
}

export function GetPackLeaders(): Promise<Leader[]> {
    return APIClient.get('/packs/leaders').then(res => res.data);
}