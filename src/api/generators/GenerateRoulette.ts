import APIClient from '../APIClient';

export interface RouletteResponse {
    ID: number;
    Rating: number;
    Enjoyment: number;
    RatingCount: number;
    Meta?: {
        Name: string;
    };
    Name?: string;
}

function NaNToNull(value?: number) {
    return value === undefined || isNaN(value) ? null : value;
}

export default async function GenerateRoulette(minTier?: number, maxTier?: number, minEnjoyment?: number, maxEnjoyment?: number, difficulty?: number, excludeCompleted?: boolean) {
    const res = await APIClient.get<RouletteResponse[]>('/roulette', { params: {
        minTier: NaNToNull(minTier),
        maxTier: NaNToNull(maxTier),
        minEnjoyment: NaNToNull(minEnjoyment),
        maxEnjoyment: NaNToNull(maxEnjoyment),
        difficulty,
        excludeCompleted,
    } });
    return res.data;
}
