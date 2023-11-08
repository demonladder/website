import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function CreateTag(name: string, description: string) {
    const csrfToken = StorageManager.getCSRF();

    return APIClient.post('/tags', { name, description, csrfToken }, { withCredentials: true });
}