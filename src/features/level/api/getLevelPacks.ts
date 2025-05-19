import APIClient from '../../../api/APIClient';
import Pack from '../../../api/types/Pack';
import PackMeta from '../../../api/types/PackMeta';

interface GetLevelPacksResponse extends Pack {
    Meta: PackMeta;
};

export async function getLevelPacks(levelID: number): Promise<GetLevelPacksResponse[]> {
    const res = await APIClient.get<GetLevelPacksResponse[]>(`/level/${levelID}/packs`);
    return res.data;
}
