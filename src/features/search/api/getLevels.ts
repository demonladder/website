import APIClient from '../../../api/APIClient';
import { Difficulties, Rarity } from '../../level/types/LevelMeta';

interface SearchInfo {
    total: number;
    limit: number;
    page: number;
    levels: (SearchLevelResponse)[];
}

export interface SearchLevelRequest {
    limit?: number;
    name?: string | null;
    page: number;
    sortDirection?: string;
}

export interface SearchLevelResponse {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Completed: 0 | 1;
    InPack: 0 | 1;
    Meta: {
        Name: string;
        Creator: string;
        Difficulty: Difficulties;
        Rarity: Rarity;
        Song: {
            Name: string;
        };
    };  
}

export async function getLevels(q: SearchLevelRequest): Promise<SearchInfo> {
    const res = await APIClient.get<SearchInfo>('/level/search', {
        params: { limit: 16, ...q, properties: 'total,limit,page,levels(ID,Rating,Enjoyment,Showcase,Completed,InPack,Meta(Name,Creator,Difficulty,Rarity,Song(Name)))' },
    });
    return res.data;
}
