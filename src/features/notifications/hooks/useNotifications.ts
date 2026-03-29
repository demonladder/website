import { useQuery } from '@tanstack/react-query';
import GetNotifications from '../../../api/notifications/GetNotificationsRequest';
import useSession from '../../../hooks/useSession';
import ms from 'ms';

export function useNotifications() {
    const session = useSession();

    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => GetNotifications(),
        staleTime: ms('15m'),
        enabled: session.user !== undefined,
    });
}
