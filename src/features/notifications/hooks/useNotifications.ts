import { useQuery } from '@tanstack/react-query';
import GetNotifications from '../../../api/notifications/GetNotificationsRequest';

export function useNotifications() {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => GetNotifications(),
    });
}
