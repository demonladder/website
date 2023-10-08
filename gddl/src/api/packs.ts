import StorageManager from '../utils/StorageManager';
import APIClient from './axios';
import CategoryResponse from './packs/responses/Category';

export interface PackLevel {
    LevelID: number;
    Name: string;
    Rating: number | null;
    Enjoyment: number | null;
    Difficulty: string;
    Song: string;
    Creator: string;
    EX: 0 | 1;
    Completed: 0 | 1;
};

export type PackShell = {
    ID: number,
    CategoryID: number,
    Name: string,
    IconName: string,
    LevelCount: number;
    AverageEnjoyment: number;
    MedianTier: number;
};

export type PackInfo = {
    packs: PackShell[]
    categories: CategoryResponse[]
};

export async function GetPacks(): Promise<PackInfo> {
    const res = await APIClient.get('/packs');
    return res.data;
};

export async function SearchPacks(name: string): Promise<PackShell[]> {
    const res = await APIClient.get('/packs/search', { params: { chunk: 5, name, }});
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
    AccentColor: number | null,
    DiscordID: string,
    Avatar: string | null,
}

export function GetPackLeaders(): Promise<Leader[]> {
    return APIClient.get('/packs/leaders').then(res => res.data);
}