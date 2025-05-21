import { useQuery } from '@tanstack/react-query';
import { getVerifiedUsers, GetVerifiedUsersResponseOptions } from '../api/getVerifiedUsers';

export function useVerifiedUsers(options: GetVerifiedUsersResponseOptions = {}) {
    return useQuery({
        queryKey: ['verifiedUsers', options],
        queryFn: () => getVerifiedUsers(options),
    });
}
