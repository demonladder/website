import { useEffect, useState } from 'react';
import { useNotifications } from '../../features/notifications/hooks/useNotifications';
import { Heading4 } from '../headings';
import { secondsToHumanReadable } from '../../utils/secondsToHumanReadable';
import { useMutation } from '@tanstack/react-query';
import { deleteNotification } from '../../features/notifications/api/deleteNotification';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';

export default function NotificationButton() {
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        if (showNotifications) {
            void notifications.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNotifications]);

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            void notifications.refetch();
        },
        onError: (err: AxiosError) => {
            toast.error(renderToastError.render({ data: err }));
        },
    });

    const unreadNotifications = notifications.data?.filter((notification) => !notification.IsRead).length ?? 0;

    return (
        <div className='relative'>
            <button className='relative text-3xl hover:bg-black/8 active:bg-black/12 rounded-full size-12 transition-colors' onClick={() => setShowNotifications((prev) => !prev)}>
                <i className={`bx ${notifications.data?.filter((n) => !n.IsRead).length ? 'bxs-bell' : 'bx-bell'}`} />
                {unreadNotifications > 0 &&
                    <span className='absolute top-0 right-0 bg-red-500 text-base text-white rounded-full size-6'>{unreadNotifications}</span>
                }
            </button>
            {showNotifications && (
                <>
                    <div className='fixed z-30 inset-0' onClick={() => setShowNotifications(false)}></div>
                    <div className='absolute z-30 right-0 bg-theme-700 text-theme-text border border-theme-400 rounded-lg shadow-lg w-md'>
                        <div className='flex justify-between items-center px-4 py-2 border-b border-theme-400'>
                            <Heading4>Notifications</Heading4>
                            <button className='text-theme-text hover:text-theme-text/80 transition-colors' onClick={() => void notifications.refetch()}>
                                <i className='bx bx-refresh text-2xl' />
                            </button>
                        </div>
                        {notifications.data?.length === 0 && (
                            <p className='p-4 text-theme-400'>No notifications</p>
                        )}
                        <ul className='pt-2 max-h-96 overflow-y-auto scrollbar-thin'>
                            {notifications.data?.map((notification) => (
                                <li key={notification.ID} className='py-2 hover:bg-theme-800'>
                                    <div className='px-4 flex justify-between items-center'>
                                        <div>
                                            <p>{notification.Message}</p>
                                            <p className='text-sm text-theme-400'>{secondsToHumanReadable(Math.floor((Date.now() - notification.SentAt.getTime()) / 1000))} ago</p>
                                        </div>
                                        <button className='text-theme-400 hover:text-theme-400/80 transition-colors p-1' onClick={() => !deleteMutation.isPending && deleteMutation.mutate(notification.ID)}>
                                            <i className='bx bxs-trash' />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
