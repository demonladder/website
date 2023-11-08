import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function DeactivateBotRequest() {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/bot/deactivate', { csrfToken }, { withCredentials: true });
}