import { useQuery } from '@tanstack/react-query';
import { usersClient } from '../api';

export function useUserRoles(userID: number) {
    return useQuery({
        queryKey: ['user', userID, 'roles'],
        queryFn: () => usersClient.getRoles(userID),
    });
}
