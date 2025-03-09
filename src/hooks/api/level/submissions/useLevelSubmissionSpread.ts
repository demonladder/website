import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../../api/APIClient';

interface SpreadResponse {
    rating: {
        Rating: number;
        Count: number;
    }[];
    twoPlayerRating: {
        Rating: number;
        Count: number;
    }[];
    enjoyment: {
        Enjoyment: number;
        Count: number;
    }[];
    twoPlayerEnjoyment: {
        Enjoyment: number;
        Count: number;
    }[];
}

export function useLevelSubmissionSpread(levelID: number) {
    return useQuery({
        queryKey: ['level', levelID, 'submissions', 'spread'],
        queryFn: () => APIClient.get<SpreadResponse>(`/level/${levelID}/submissions/spread`).then((res) => res.data),
    });
}
