import storageManager from '../utils/storageManager';
import instance from './axios';

export interface Level {
    LevelID: number,
    Name: string,
    Rating: number | null,
    Enjoyment: number | null,
    Difficulty: string,
    Song: string,
    Creator: string,
    InPack?: number,
}

export type FullLevel = {
    LevelID: number,
    Name: string,
    Rating: number,
    Enjoyment: number,
    Deviation: number,
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

type Query = {

}

export async function SearchLevels(q: Query): Promise<SearchInfo> {
    const csrfToken = storageManager.getCSRF() || '';
    return (await instance.get('/level/search', {
        withCredentials: true,
        params: { chunk: 16, ...q, csrfToken },
    })).data;
}

export async function GetLevel(id: number | null): Promise<FullLevel | null> {
    if (id === null) return null;

    return (await instance.get(`/level?levelID=${id}`)).data;
}
export async function GetShortLevel(id: number | null): Promise<FullLevel | null> {
    if (id === null) return null;

    return (await instance.get(`/level/short?levelID=${id}`)).data;
}

export function GetLevelPacks(levelID: number): Promise<{ ID: number, Name: string, IconName: string }[]> {
    return instance.get(`/level/packs?levelID=${levelID}`).then(res => res.data);
}

export function AddLevelToDatabase(levelID: number) {
    return instance.post('/level/add', { levelID }, { withCredentials: true, params: { csrfToken: storageManager.getCSRF() }});
}