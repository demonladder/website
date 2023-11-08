import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function ActivateBotRequest() {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/bot/activate', { csrfToken }, { withCredentials: true });
}