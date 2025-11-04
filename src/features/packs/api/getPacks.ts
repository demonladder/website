import APIClient from '../../../api/APIClient';
import Pack from '../../singlePack/types/Pack';
import PackCategory from '../../singlePack/types/PackCategory';
import PackMeta from '../../singlePack/types/PackMeta';

export interface GetPacksResponse {
    packs: (Pack & { Meta: PackMeta | null; Completed: 0 | 1 })[];
    categories: PackCategory[];
}

export async function getPacks(): Promise<GetPacksResponse> {
    const res = await APIClient.get<GetPacksResponse>('/packs');
    return res.data;
}
