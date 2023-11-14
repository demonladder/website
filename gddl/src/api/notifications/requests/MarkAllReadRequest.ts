import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function MarkAllReadRequest() {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/notifications/markAllRead', { csrfToken }, { withCredentials: true });
}