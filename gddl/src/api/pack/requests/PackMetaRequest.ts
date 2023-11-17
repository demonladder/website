import APIClient from '../../APIClient';
import PackMetaResponse from '../responses/PackMetaResponse';

export default async function PackMetaRequest(packID: number): Promise<PackMetaResponse> {
    const res = await APIClient.get('/pack/meta', { params: { packID } });
    return res.data;
}