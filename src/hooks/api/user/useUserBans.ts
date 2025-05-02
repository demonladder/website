import { useQuery } from '@tanstack/react-query';
import { getBanHistory } from '../../../api/user/bans/getBanHistory';

export function useUserBans(userID?: number) {
    return useQuery({
        queryKey: ['user', userID, 'bans'],
        queryFn: () => getBanHistory(userID),
        enabled: userID !== undefined,
    });
}
