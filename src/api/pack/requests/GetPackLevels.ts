import APIClient from '../../APIClient';
import PackLevel from '../../types/PackLevel';

export type GetPackLevelsResponse = PackLevel & { Name: string };

export default async function GetPackLevels(packID: number) {
    const res = await APIClient.get<GetPackLevelsResponse[]>(`/packs/${packID}/levels`);
    return res.data;
}