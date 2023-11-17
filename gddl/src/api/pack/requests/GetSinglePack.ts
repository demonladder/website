import PackResponse from '../responses/PackResponse';
import APIClient from '../../APIClient';

export async function GetSinglePack(packID: number): Promise<PackResponse> {
    const res = await APIClient.get('/pack', { params: { packID } });
    return { ...res.data, ID: packID };
}
