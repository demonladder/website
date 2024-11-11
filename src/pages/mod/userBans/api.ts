import APIClient from '../../../api/APIClient';
import UserBan from '../../../api/types/UserBan';

export async function GetBanHistory(userID: number | undefined) {
    if (userID === undefined) {
        return [];
    }

    const res = await APIClient.get<UserBan[]>('/user/ban', { params: { userID } });
    return res.data;
}

export function BanUser(userID: number, duration: number, reason?: string) {
    return APIClient.post('/user/ban', { userID, duration: duration * 7 * 24 * 60 * 60, reason });  // Client uses weeks, api uses seconds
}

export function RevokeBan(banID: number) {
    return APIClient.delete('/user/ban/revoke', { params: { banID }});
}