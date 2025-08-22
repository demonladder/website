import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserLists } from '../api/getUserLists';

export function useUserLists(
    userID: number,
    options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof getUserLists>>>, 'queryKey' | 'queryFn'>,
) {
    return useQuery({
        queryKey: ['user', userID, 'lists'],
        queryFn: () => getUserLists(userID),
        ...options,
    });
}
