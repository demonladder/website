import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function UpdateBotCommandsRequest() {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/bot/updateCommands', { csrfToken }, { withCredentials: true });
}