import { useQuery } from '@tanstack/react-query';
import {
    getUsersEligibleForVerification,
    GetUsersEligibleForVerificationOptions,
} from '../api/getUsersEligibleForVerification';

export function useUsersEligibleForVerification(options?: GetUsersEligibleForVerificationOptions) {
    return useQuery({
        queryKey: ['usersEligibleForVerification', options],
        queryFn: () => getUsersEligibleForVerification(options),
    });
}
