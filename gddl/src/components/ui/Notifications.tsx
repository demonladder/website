import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetNotifications, NotificationResponse } from '../../api/notifications/requests/GetNotificationsRequest';
import { useState } from 'react';
import { MarkReadNotifications } from '../../api/notifications/requests/MarkReadNotifications';

export default function Notifications() {
    const [show, setShow] = useState(false);
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['notifications'],
        queryFn: GetNotifications,
    });

    function openNotifications() {
        if (data === undefined) return;
        if (show) {
            setShow(false);
            return;
        }

        setShow(true);
        MarkReadNotifications(data.slice(0, 5).filter((notif) => !notif.IsRead).map((notif) => notif.ID))?.then(() => {
            queryClient.invalidateQueries(['notifications']);
        });
    }

    return (
        <div className='cursor-pointer relative'>
            {(data?.filter((n) => !n.IsRead).length || 0) > 0
                ? <i className='bx bxs-envelope text-2xl' onClick={openNotifications}></i>
                : <i className='bx bx-envelope-open text-2xl' onClick={openNotifications}></i>
            }
            <div className={'absolute w-72 z-10 left-1/2 -translate-x-1/2 bg-gray-500 text-white round:rounded-lg transition-opacity ' + (show ? 'opacity-100' : 'opacity-0')} id='notificationsBox'>
                <div className='flex justify-between'>
                    <h4 className='font-bold p-2'>Notifications</h4>
                    <button className='px-2 text-2xl' onClick={() => setShow(false)}><i className='bx bx-x'></i></button>
                </div>
                <div className='divider'></div>
                {data?.length === 0 &&
                    <p className='p-2'>No unread notifications</p>
                }
                <div>{
                    data?.slice(0, 5).map((notif) => (<Notification notification={notif} />))
                }</div>
            </div>
        </div>
    );
}

function Notification({ notification }: { notification: NotificationResponse }) {
    return (
        <div className='py-1'>
            <div className={'px-2 py-1' + (notification.IsRead ? '' : ' bg-blue-900 bg-opacity-75')}>
                <p>{notification.Message}</p>
                <p className='text-sm text-gray-300'>Sent at {notification.SentAt.toLocaleString()}</p>

            </div>
        </div>
    );
}