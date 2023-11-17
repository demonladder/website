import APIClient from '../../APIClient';
import { PackInfo } from '../responses/PackInfo';

export async function GetPacks(): Promise<PackInfo> {
    const res = await APIClient.get('/packs');
    return res.data;
}