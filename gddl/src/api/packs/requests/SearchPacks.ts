import APIClient from '../../APIClient';
import { PackShell } from '../types/PackShell';

export async function SearchPacks(name: string): Promise<PackShell[]> {
    const res = await APIClient.get('/packs/search', { params: { chunk: 5, name, } });
    return res.data;
}