import APIClient from './APIClient';
import { PackShell } from './packs/types/PackShell';

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

export interface Meta {
    ID: number;
    Name: string;
    Creator: string;
    Description: string;
    SongID: number;
    Length: 'Tiny' | 'Short' | 'Medium' | 'Long' | 'XL' | 'Platformer';
    IsTwoPlayer: boolean;
    Difficulty: string;
    Song: {
        ID: number;
        Name: string;
        Author: string;
        Size: string;
    };
}

export interface FullLevel {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Deviation: number | null;
    RatingCount: number;
    EnjoymentCount: number;
    SubmissionCount: number;
    TwoPlayerRating: number | null;
    TwoPlayerDeviation: number | null;
    DefaultRating: number | null;
    Showcase: string | null;
    Meta: Meta;
}

interface ShortLevel {
    LevelID: number;
    Name: string;
    Rating: number | null;
    Enjoyment: number | null;
    Length: string;
}

type SearchInfo = {
    total: number,
    limit: number,
    page: number,
    levels: (FullLevel & {
        Completed: 0 | 1;
        InPack: 0 | 1;
    })[],
}

function lengthIndexToLength(index: number) {
    switch (index) {
        default:
        case 1: return 'Tiny';
        case 2: return 'Short';
        case 3: return 'Medium';
        case 4: return 'Long';
        case 5: return 'XL';
        case 6: return 'Platformer';
    }
}

export function SearchLevels(q: object): Promise<SearchInfo> {
    return APIClient.get('/level/search', {
        params: { chunk: 16, ...q },
    }).then((res) => res.data as SearchInfo);
}

export async function GetLevel(ID: number | null): Promise<FullLevel | null> {
    if (ID === null) return null;

    const response = (await APIClient.get(`/v2/levels/${ID}`)).data as FullLevel | null;
    if (response === null) {
        return null;
    }

    response.Meta.Length = lengthIndexToLength((response.Meta.Length as unknown) as number);
    response.Meta.IsTwoPlayer = ((response.Meta.IsTwoPlayer as unknown) as 0 | 1) === 1;

    return response;
}

export async function GetShortLevel(ID: number | null): Promise<ShortLevel | null> {
    if (ID === null) return null;

    const response = (await APIClient.get(`/level/short?levelID=${ID}`)).data as (ShortLevel & { Length: number }) | null;
    if (response === null) return null;

    return {
        ...response,
        Length: lengthIndexToLength(response.Length),
    };
}

export function GetLevelPacks(levelID: number): Promise<PackShell[]> {
    return APIClient.get(`/level/packs?levelID=${levelID}`).then(res => res.data as PackShell[]);
}

export function AddLevelToDatabase(levelID: number) {
    return APIClient.post('/level', { levelID });
}