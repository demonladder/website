import APIClient from '../../../../../api/APIClient';
import { NaNToNull } from '../../../../../utils/NaNToNull';

export interface AlphabetResponse {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Meta?: {
        Name: string;
    };
    Name?: string;
}

export async function generateAlphabet(minTier?: number, maxTier?: number, minEnjoyment?: number, maxEnjoyment?: number, difficulty?: string, uncompletedOnly = false) {
    const res = await APIClient.get<AlphabetResponse[]>('/alphabet', { params: {
        minTier: NaNToNull(minTier),
        maxTier: NaNToNull(maxTier),
        minEnjoyment: NaNToNull(minEnjoyment),
        maxEnjoyment: NaNToNull(maxEnjoyment),
        difficulty,
        uncompletedOnly,
    } });
    return res.data;
}
