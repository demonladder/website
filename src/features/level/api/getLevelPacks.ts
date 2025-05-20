import APIClient from '../../../api/APIClient';
import Pack from '../../singlePack/types/Pack';
import PackMeta from '../../singlePack/types/PackMeta';

interface GetLevelPacksResponse extends Pack {
    Meta: PackMeta;
};

export async function getLevelPacks(levelID: number): Promise<GetLevelPacksResponse[]> {
    const res = await APIClient.get<GetLevelPacksResponse[]>(`/level/${levelID}/packs`);
    return res.data;
}
