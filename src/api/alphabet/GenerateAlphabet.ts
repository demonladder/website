import APIClient from '../APIClient';
import { NaNToNull } from '../../utils/NaNToNull';

export interface AlphabetResponse {
    ID: number;
    Name: string;
    Rating: number;
    Enjoyment: number;
    RatingCount: number;
}

export default async function GenerateAlphabet(minTier?: number, maxTier?: number, minEnjoyment?: number, maxEnjoyment?: number, difficulty?: string) {
    const res = await APIClient.get<AlphabetResponse[]>('/alphabet', { params: {
        minTier: NaNToNull(minTier),
        maxTier: NaNToNull(maxTier),
        minEnjoyment: NaNToNull(minEnjoyment),
        maxEnjoyment: NaNToNull(maxEnjoyment),
        difficulty,
    } });
    return res.data;
}