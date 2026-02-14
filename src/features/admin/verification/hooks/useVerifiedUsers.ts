import { useQuery } from '@tanstack/react-query';
import { usersClient, type GetVerifiedRequest } from '../../../../api';

export function useVerifiedUsers(options: GetVerifiedRequest = {}) {
    return useQuery({
        queryKey: ['verifiedUsers', options],
        queryFn: () => usersClient.getVerified(options),
    });
}
