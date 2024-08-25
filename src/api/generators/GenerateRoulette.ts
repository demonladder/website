import APIClient from '../APIClient';

export interface RouletteResponse {
    ID: number;
    Name: string;
    Rating: number;
    Enjoyment: number;
    RatingCount: number;
}

function NaNToNull(value?: number) {
    return value === undefined || isNaN(value) ? null : value;
}

export default async function GenerateRoulette(minTier?: number, maxTier?: number, minEnjoyment?: number, maxEnjoyment?: number, difficulty?: string) {
    const res = await APIClient.get<RouletteResponse[]>('/roulette', { params: {
        minTier: NaNToNull(minTier),
        maxTier: NaNToNull(maxTier),
        minEnjoyment: NaNToNull(minEnjoyment),
        maxEnjoyment: NaNToNull(maxEnjoyment),
        difficulty,
    } });
    return res.data;
}