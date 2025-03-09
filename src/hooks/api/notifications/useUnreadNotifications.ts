import { useQuery } from '@tanstack/react-query';
import GetNotifications from '../../../api/notifications/GetNotificationsRequest';

export function useUnreadNotifications() {
    return useQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: () => GetNotifications({ allOrUnread: 'unread' }),
    });
}
