import { useQuery } from '@tanstack/react-query';
import GetUser from '../../api/user/GetUser';

export default function useUserQuery(userID: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID),
        ...options,
    });
}
