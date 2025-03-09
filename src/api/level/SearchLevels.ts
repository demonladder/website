import APIClient from '../APIClient';
import { FullLevel } from '../types/compounds/FullLevel';

type SearchInfo = {
    total: number;
    limit: number;
    page: number;
    levels: (SearchLevelDTO)[];
};

export interface SearchLevelDTO extends FullLevel {
    Completed: 0 | 1;
    InPack: 0 | 1;
}

export default async function SearchLevels(q: object): Promise<SearchInfo> {
    const res = await APIClient.get<SearchInfo>('/level/search', {
        params: { chunk: 16, ...q },
    });
    return res.data;
}
