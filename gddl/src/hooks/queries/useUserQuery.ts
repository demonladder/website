import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUser } from '../../api/user/GetUser';

export default function useUserQuery(userID: number, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID),
        ...options,
    });

    return {
        ...query,
        invalidate: () => queryClient.invalidateQueries(['user', userID]),
    }
}