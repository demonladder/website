import { useQuery } from '@tanstack/react-query';
import { getVerificationRole } from '../api/getVerificationRole';

export function useVerificationRole() {
    return useQuery({
        queryKey: ['verificationRole'],
        queryFn: getVerificationRole,
    });
}
