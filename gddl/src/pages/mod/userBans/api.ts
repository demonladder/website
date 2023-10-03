import APIClient from '../../../api/axios';
import storageManager from '../../../utils/StorageManager';

export interface BanRecord {
    BanID: number
    StaffID: number
    StaffName: string
    BanStart: string
    BanStop: string
    Reason: string
}

export async function GetBanHistory(userID: number | undefined): Promise<BanRecord[]> {
    if (userID === undefined) {
        return [];
    }

    const csrfToken = storageManager.getCSRF();
    const res = await APIClient.get('/user/ban', { withCredentials: true, params: { userID, csrfToken } });
    return res.data;
}

export function BanUser(userID: number, duration: number, reason?: string) {
    const csrfToken = storageManager.getCSRF();
    return APIClient.post('/user/ban', { userID, duration: duration * 7 * 24 * 60 * 60, reason, csrfToken }, { withCredentials: true });  // Client uses weeks, api uses seconds
}

export function RevokeBan(banID: number) {
    const csrfToken = storageManager.getCSRF();
    return APIClient.delete('/user/ban/revoke', { withCredentials: true, params: { banID, csrfToken }});
}