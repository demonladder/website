import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';
import PackMetaResponse from '../responses/PackMetaResponse';

export default async function PackMetaRequest(packID: number): Promise<PackMetaResponse> {
    const csrfToken = StorageManager.getCSRF();
    const res = await APIClient.get('/pack/meta', { params: { packID, csrfToken }, withCredentials: true });
    return res.data;
}