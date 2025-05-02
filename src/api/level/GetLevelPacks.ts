import APIClient from '../APIClient';
import Pack from '../types/Pack';
import PackMeta from '../types/PackMeta';

interface GetLevelPacksResponse extends Pack {
    Meta: PackMeta;
};

export default async function GetLevelPacks(levelID: number): Promise<GetLevelPacksResponse[]> {
    const res = await APIClient.get<GetLevelPacksResponse[]>(`/level/${levelID}/packs`);
    return res.data;
}
