import APIClient from '../../../api/APIClient';
import Pack from '../types/Pack';

export async function getPack(packID: number) {
    const res = await APIClient.get<Pack>(`/packs/${packID}`);
    return res.data;
}
