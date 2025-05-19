import { useQuery } from '@tanstack/react-query';
import { getUserLists } from '../api/getUserLists';

export function useUserLists(userID: number) {
    return useQuery({
        queryKey: ['user', userID, 'lists'],
        queryFn: () => getUserLists(userID),
    });
}
