import { useQuery } from '@tanstack/react-query';
import { getLevel } from '../api/getLevel';

export function useLevel(levelID: number | null) {
    return useQuery({
        queryKey: ['level', levelID],
        queryFn: () => getLevel(levelID),
        enabled: levelID !== null,
    });
}
