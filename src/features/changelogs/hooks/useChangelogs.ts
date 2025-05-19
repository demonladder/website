import { useQuery } from '@tanstack/react-query';
import { getChangelogs } from '../api/getChangelogs';

export function useChangelogs() {
    return useQuery({
        queryKey: ['changelogs'],
        queryFn: getChangelogs,
    });
}
