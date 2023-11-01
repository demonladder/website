import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function SavePackDescriptionRequest(packID: number, description: string, roleID: string) {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/pack/meta', { packID, description, roleID, csrfToken }, { withCredentials: true});
}