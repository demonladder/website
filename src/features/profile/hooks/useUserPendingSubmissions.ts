import { useQuery } from '@tanstack/react-query';
import { getUserPendingSubmissions } from '../api/getUserPendingSubmissions';

export function useUserPendingSubmissions(userID: number) {
    return useQuery({
        queryKey: ['user', userID, 'submissions', 'pending'],
        queryFn: () => getUserPendingSubmissions(userID),
    });

}