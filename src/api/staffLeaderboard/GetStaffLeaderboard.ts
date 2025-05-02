import APIClient from '../APIClient';
import User from '../types/User';

export interface StaffLeaderboardRecord {
    UserID: number;
    Points: number;
    User?: User;
}

export default async function GetStaffLeaderboard() {
    const res = await APIClient.get<StaffLeaderboardRecord[]>('/staff/leaderboard');
    return res.data;
}
