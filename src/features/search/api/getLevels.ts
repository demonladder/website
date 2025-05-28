import APIClient from '../../../api/APIClient';
import { FullLevel } from '../../../api/types/compounds/FullLevel';

interface SearchInfo {
    total: number;
    limit: number;
    page: number;
    levels: (SearchLevelResponse)[];
}

export interface SearchLevelRequest {
    limit?: number;
    name?: string;
    page: number;
}

export interface SearchLevelResponse extends FullLevel {
    Completed: 0 | 1;
    InPack: 0 | 1;
}

export async function getLevels(q: SearchLevelRequest): Promise<SearchInfo> {
    const res = await APIClient.get<SearchInfo>('/level/search', {
        params: { limit: 16, ...q },
    });
    return res.data;
}
