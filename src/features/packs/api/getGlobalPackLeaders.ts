import APIClient from '../../../api/APIClient';
import type DiscordUserData from '../../../api/types/DiscordUserData';
import User from '../../../api/types/User';

interface PackLeaderResponse {
    UserID: number;
    Sum: number;
    User: User & {
        DiscordData: Pick<DiscordUserData, 'AccentColor'> | null;
    };
}

export async function getGlobalPackLeaders(packID?: number): Promise<PackLeaderResponse[]> {
    if (packID !== undefined)
        return await APIClient.get<PackLeaderResponse[]>(`/packs/${packID}/leaderboard`).then((res) => res.data);
    return await APIClient.get<PackLeaderResponse[]>('/packs/leaderboard').then((res) => res.data);
}
