import APIClient from '../../APIClient';
import Pack from '../../types/Pack';
import PackMeta from '../../types/PackMeta';

interface SearchPacksResponse extends Pack {
    Meta: PackMeta;
}

export default async function SearchPacks(name: string): Promise<SearchPacksResponse[]> {
    const res = await APIClient.get<SearchPacksResponse[]>('/packs/search', { params: { limit: 5, name, } });
    return res.data;
}
