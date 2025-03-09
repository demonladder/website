import APIClient from '../../APIClient';
import Pack from '../../types/Pack';
import PackCategory from '../../types/PackCategory';
import PackMeta from '../../types/PackMeta';

export interface GetPacksResponse {
    packs: (Pack & { Meta: PackMeta | null, Completed: 0 | 1 })[];
    categories: PackCategory[];
}

export async function getPacks(): Promise<GetPacksResponse> {
    const res = await APIClient.get<GetPacksResponse>('/packs');
    return res.data;
}
