import { useQuery } from '@tanstack/react-query';
import { searchUsers, type SearchUserOptions } from '../../../api/user/searchUsers';

export function useSearchUsers(searchUserOptions: SearchUserOptions) {
    return useQuery({
        queryKey: ['searchUsers', searchUserOptions],
        queryFn: () => searchUsers(searchUserOptions),
    });
}
