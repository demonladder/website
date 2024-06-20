import APIClient from '../APIClient';
import Pack from '../types/Pack';
import PackLevel from '../types/PackLevel';
import PackMeta from '../types/PackMeta';

type GetLevelPacksResponse = (PackLevel & { Pack: Pack & { Meta: PackMeta } })[];

export default async function GetLevelPacks(levelID: number): Promise<GetLevelPacksResponse> {
    const res = await APIClient.get(`/v2/level/${levelID}/packs`);
    return res.data as GetLevelPacksResponse;
}