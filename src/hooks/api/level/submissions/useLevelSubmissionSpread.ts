import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../../api/APIClient';

interface SpreadResponse {
    rating: Record<string, number>;
    twoPlayerRating: Record<string, number>;
    enjoyment: Record<string, number>;
    twoPlayerEnjoyment: Record<string, number>;
}

async function getSubmissionSpread(levelID: number) {
    const res = await APIClient.get<SpreadResponse>(`/levels/${levelID}/submissions/spread`);
    const data = res.data;

    return {
        rating: Object.entries(data.rating).map(([key, value]) => ({ Rating: Number(key), Count: value })),
        twoPlayerRating: Object.entries(data.twoPlayerRating).map(([key, value]) => ({
            Rating: Number(key),
            Count: value,
        })),
        enjoyment: Object.entries(data.enjoyment).map(([key, value]) => ({ Enjoyment: Number(key), Count: value })),
        twoPlayerEnjoyment: Object.entries(data.twoPlayerEnjoyment).map(([key, value]) => ({
            Enjoyment: Number(key),
            Count: value,
        })),
    };
}

export function useLevelSubmissionSpread(levelID: number, enabled = true) {
    return useQuery({
        queryKey: ['level', levelID, 'submissions', 'spread'],
        queryFn: () => getSubmissionSpread(levelID),
        enabled,
    });
}
