import { useQuery } from '@tanstack/react-query';
import GetNotifications from '../../../api/notifications/GetNotificationsRequest';
import useSession from '../../../hooks/useSession';

export function useNotifications() {
    const session = useSession();

    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => GetNotifications(),
        enabled: session.user !== undefined,
    });
}
