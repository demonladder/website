import APIClient from '../../APIClient';
import UserBan from '../../types/UserBan';

export async function getBanHistory(userID?: number) {
    if (userID === undefined) return [];

    const res = await APIClient.get<UserBan[]>('/user/ban', { params: { userID } });
    return res.data;
}
