import APIClient from '../../../api/APIClient';
import { Difficulties, Rarity } from '../../level/types/LevelMeta';

interface SearchInfo {
    total: number;
    limit: number;
    page: number;
    data: SearchLevelResponse[];
}

export interface SearchLevelRequest {
    limit?: number;
    name?: string | null;
    page: number;
    sort?: string;
    sortDirection?: string;
    difficulty?: number;
    inPack?: boolean;
}

export interface SearchLevelResponse {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Completed?: 0 | 1;
    InPack: 0 | 1;
    Meta: {
        Name: string;
        Difficulty: Difficulties;
        Rarity: Rarity;
        Song: {
            Name: string;
        };
        Publisher?: {
            name: string | null;
        };
    };
}

export async function getLevels(q: SearchLevelRequest): Promise<SearchInfo> {
    const res = await APIClient.get<SearchInfo>('/levels', {
        params: {
            limit: 16,
            ...q,
        },
    });
    return res.data;
}
