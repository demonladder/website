import storageManager from '../utils/StorageManager';
import APIClient from './axios';
import { PackShell } from './packs';

export interface Level {
    LevelID: number,
    Name: string,
    Rating: number | null,
    Enjoyment: number | null,
    Difficulty: string,
    Song: string,
    Creator: string,
    InPack?: 0 | 1,
    Completed?: 0 | 1;
}

export type FullLevel = {
    LevelID: number,
    Name: string,
    Rating: number,
    Enjoyment: number,
    Deviation: number | null,
    RatingCount: number,
    EnjoymentCount: number,
    SubmissionCount: number,
    Difficulty: string,
    Song: string,
    Creator: string,
}

type SearchInfo = {
    total: number,
    limit: number,
    page: number,
    levels: Level[],
}

export function SearchLevels(q: object): Promise<SearchInfo> {
    const csrfToken = storageManager.getCSRF() || '';
    return APIClient.get('/level/search', {
        withCredentials: true,
        params: { chunk: 16, ...q, csrfToken },
    }).then((res) => res.data as SearchInfo);
}

export async function GetLevel(id: number | null): Promise<FullLevel | null> {
    if (id === null) return null;

    return (await APIClient.get(`/level?levelID=${id}`)).data as FullLevel | null;
}
export async function GetShortLevel(id: number | null): Promise<FullLevel | null> {
    if (id === null) return null;

    return (await APIClient.get(`/level/short?levelID=${id}`)).data as FullLevel | null;
}

export function GetLevelPacks(levelID: number): Promise<PackShell[]> {
    return APIClient.get(`/level/packs?levelID=${levelID}`).then(res => res.data as PackShell[]);
}

export function AddLevelToDatabase(levelID: number) {
    return APIClient.post('/level', { levelID }, { withCredentials: true, params: { csrfToken: storageManager.getCSRF() }});
}