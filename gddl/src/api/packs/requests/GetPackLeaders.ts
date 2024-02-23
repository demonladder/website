import APIClient from '../../APIClient';
import { Leader } from '../types/Leader';

interface PackLeaderResponse {
    leaderboard: Leader[];
    aroundYou?: Leader[];
}

export function GetPackLeaders(packID?: number): Promise<PackLeaderResponse> {
    if (packID !== undefined) return APIClient.get(`/pack/${packID}/leaders`).then(res => res.data);
    return APIClient.get('/packs/leaders').then(res => res.data);
}