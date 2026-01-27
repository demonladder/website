import APIClient from '../../../api/APIClient';
import User from '../../../api/types/User';

interface PackLeaderResponse {
    UserID: number;
    Sum: number;
    User: Pick<User, 'Name' | 'avatar' | 'accentColor'>;
}

export async function getGlobalPackLeaders(packID?: number): Promise<PackLeaderResponse[]> {
    if (packID !== undefined)
        return await APIClient.get<PackLeaderResponse[]>(`/packs/${packID}/leaderboard`).then((res) => res.data);
    return await APIClient.get<PackLeaderResponse[]>('/packs/leaderboard').then((res) => res.data);
}
