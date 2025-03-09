import APIClient from '../../APIClient';
import { Leader } from '../types/Leader';

interface PackLeaderResponse {
    leaderboard: Leader[];
    aroundYou?: Leader[];
}

export default async function GetPackLeaders(packID?: number): Promise<PackLeaderResponse> {
    if (packID !== undefined) return await APIClient.get(`/pack/${packID}/leaders`).then((res) => res.data);
    return await APIClient.get('/packs/leaders').then((res) => res.data);
}
