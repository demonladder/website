import { useQuery } from '@tanstack/react-query';
import GetNotifications from '../../api/notifications/GetNotificationsRequest';
import { Link } from 'react-router-dom';

export default function NotificationButton() {
    const { data } = useQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: () => GetNotifications({ allOrUnread: 'unread' }),
    });

    return (
        <div className='cursor-pointer relative'>
            {(data?.filter((n) => !n.IsRead).length || 0) > 0
                ? <Link to='/notifications'><i className='bx bxs-envelope text-2xl' /></Link>
                : <Link to='/notifications'><i className='bx bx-envelope-open text-2xl' /></Link>
            }
        </div>
    );
}