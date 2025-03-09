import { useQuery } from '@tanstack/react-query';
import GetLevel from '../../../api/level/GetLevel';

export function useLevel(levelID: number) {
    return useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });
}
