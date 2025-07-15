import APIClient from '../../../api/APIClient';
import { Difficulties } from '../../level/types/LevelMeta';

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
        Song: {
            Name: string;
        };
    };  
}

export async function getLevels(q: SearchLevelRequest): Promise<SearchInfo> {
    const res = await APIClient.get<SearchInfo>('/level/search', {
        params: { limit: 16, ...q, properties: 'total,limit,page,levels(ID,Rating,Enjoyment,Completed,InPack,Meta(Name,Creator,Difficulty,Song(Name)))' },
    });
    return res.data;
}
