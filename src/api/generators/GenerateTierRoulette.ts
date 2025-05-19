import APIClient from '../APIClient';
import Level from '../../features/level/types/Level';

export interface TierRouletteResponse {
    ID: number;
    Rating: number;
    Enjoyment: Level['Enjoyment'];
    Meta: {
        Name: string;
    };
}

export default async function GenerateTierRoulette() {
    const res = await APIClient.get<TierRouletteResponse[]>('/tierRoulette');
    return res.data;
}