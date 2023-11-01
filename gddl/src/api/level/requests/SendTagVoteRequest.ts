import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function SendTagVoteRequest(levelID: number, tagID: number): Promise<void> {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/level/tags', { levelID, tagID }, { withCredentials: true, params: { csrfToken } })
}