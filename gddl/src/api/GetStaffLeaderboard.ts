import APIClient from './APIClient';
import User from './v2/user';

export interface StaffLeaderboardRecord {
    UserID: number;
    Points: number;
    User?: Omit<User, 'PasswordHash'>;
}

export default function GetStaffLeaderboard(): Promise<StaffLeaderboardRecord[]> {
    return APIClient.get('/staffLeaderboard').then((res) => res.data);
}