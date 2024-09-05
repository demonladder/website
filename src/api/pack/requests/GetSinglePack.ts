import APIClient from '../../APIClient';
import Pack from '../../types/Pack';

export default async function GetSinglePack(packID: number) {
    const res = await APIClient.get<Pack>(`/packs/${packID}`);
    return res.data;
}