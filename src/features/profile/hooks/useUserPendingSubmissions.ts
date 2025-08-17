import { useQuery } from '@tanstack/react-query';
import { GetUserPendingSubmissionOptions, getUserPendingSubmissions } from '../api/getUserPendingSubmissions';

export function useUserPendingSubmissions(userID: number, options?: GetUserPendingSubmissionOptions) {
    return useQuery({
        queryKey: ['user', userID, 'submissions', 'pending', options],
        queryFn: () => getUserPendingSubmissions(userID, options),
    });
}
