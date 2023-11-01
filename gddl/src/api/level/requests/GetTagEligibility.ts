import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

interface Response {
    eligible: boolean;
    vote?: number;
}

export function GetTagEligibility(levelID: number): Promise<Response> {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.get('/level/tags/eligible', { withCredentials: true, params: { levelID, csrfToken } }).then((res) => res.data as Response);
}