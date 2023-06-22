import instance from "./axios";

export type Level = {
    ID: number,
    Name: string,
    Rating: number,
    Enjoyment: number,
    Deviation: number,
    RatingCount: number,
    EnjoymentCount: number,
    SubmissionCount: number,
    Difficulty: number,
    Song: string,
    Creator: string,
}

type SearchInfo = {
    count: number,
    levels: Level[],
}

type Query = {

}

export async function SearchLevels(q: Query): Promise<SearchInfo> {
    return (await instance.get('/level/search', {
        withCredentials: true,
        params: q,
    })).data;
}

export async function GetLevel(id: number | null): Promise<Level | null> {
    if (id === null) return null;

    return (await instance.get(`/level?levelID=${id}&returnPacks=true`)).data;
}

export function GetLevelPacks(levelID: number): Promise<{ ID: number, Name: string }[]> {
    return instance.get(`/level/packs?levelID=${levelID}`).then(res => res.data);
}