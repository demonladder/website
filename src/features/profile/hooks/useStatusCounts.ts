import { useQuery } from '@tanstack/react-query';
import { userSubmissionsClient } from '../../../api';

export function useStatusCounts(userID: number) {
    return useQuery({
        queryKey: ['user', userID, 'submissions', 'counts'],
        queryFn: () => userSubmissionsClient.getStatusCounts(userID),
    });
}
