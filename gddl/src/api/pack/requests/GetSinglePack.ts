import StorageManager from '../../../utils/StorageManager';
import PackResponse from '../responses/PackResponse';
import APIClient from '../../axios';

export async function GetSinglePack(packID: number): Promise<PackResponse> {
    const csrfToken = StorageManager.getCSRF();
    const res = await APIClient.get('/pack', { params: { packID, csrfToken }, withCredentials: true });
    return { ...res.data, ID: packID };
}
