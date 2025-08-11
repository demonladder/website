import { useQuery } from '@tanstack/react-query';
import { getUserRoles } from '../api/user/getUserRoles';

export function useUserRoles(userID: number) {
    return useQuery({
        queryKey: ['user', userID, 'roles'],
        queryFn: () => getUserRoles(userID),
    });
}
