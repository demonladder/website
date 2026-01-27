import APIClient from '../APIClient';
import User from '../types/User';

export interface StaffLeaderboardRecord {
    UserID: number;
    Points: number;
    User?: User;
}

interface ResponseDTO {
    allTime: StaffLeaderboardRecord[];
    monthly: StaffLeaderboardRecord[];
}

export default async function GetStaffLeaderboard() {
    const res = await APIClient.get<ResponseDTO>('/staff/leaderboard');
    return res.data;
}
