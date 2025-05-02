import APIClient from '../APIClient';
import { FullLevel } from '../types/compounds/FullLevel';

type SearchInfo = {
    total: number;
    limit: number;
    page: number;
    levels: (SearchLevelResponse)[];
};

export interface SearchLevelRequest {
    limit?: number;
    name?: string;
}

export interface SearchLevelResponse extends FullLevel {
    Completed: 0 | 1;
    InPack: 0 | 1;
}

export default async function SearchLevels(q: SearchLevelRequest): Promise<SearchInfo> {
    const res = await APIClient.get<SearchInfo>('/level/search', {
        params: { limit: 16, ...q },
    });
    return res.data;
}
