import storageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export default function DeletePackRequest(packID: number) {
    const csrfToken = storageManager.getCSRF();
    return APIClient.delete('/pack', { withCredentials: true, params: { packID, csrfToken } });
}