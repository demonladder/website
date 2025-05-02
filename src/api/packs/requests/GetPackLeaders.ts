import APIClient from '../../APIClient';
import DiscordUserData from '../../types/DiscordUserData';
import User from '../../types/User';

interface PackLeaderResponse {
    UserID: number;
    Sum: number;
    User: User & {
        DiscordData: DiscordUserData;
    };
}

export default async function GetPackLeaders(packID?: number): Promise<PackLeaderResponse[]> {
    if (packID !== undefined) return await APIClient.get<PackLeaderResponse[]>(`/packs/${packID}/leaderboard`).then((res) => res.data);
    return await APIClient.get<PackLeaderResponse[]>('/packs/leaderboard').then((res) => res.data);
}
