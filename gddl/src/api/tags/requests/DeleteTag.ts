import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function DeleteTag(tagID: number) {
    const csrfToken = StorageManager.getCSRF();

    return APIClient.delete('/tags', { withCredentials: true, params: { tagID, csrfToken } });
}