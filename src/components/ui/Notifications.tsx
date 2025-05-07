import { Link } from 'react-router-dom';
import { useUnreadNotifications } from '../../hooks/api/notifications/useUnreadNotifications';

export default function NotificationButton() {
    const { data } = useUnreadNotifications();

    return (
        <Link to='/notifications' className='text-theme-header-text'>
            <i className={`bx ${data?.length ? 'bxs-envelope' : 'bx-envelope-open'} text-2xl`} />
        </Link>
    );
}
