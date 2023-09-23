import storageManager from '../../../utils/storageManager';
import APIClient from '../../axios';

export default function DeletePackRequest(packID: number) {
    const csrfToken = storageManager.getCSRF();
    return APIClient.delete('/pack/delete', { withCredentials: true, params: { packID, csrfToken } });
}