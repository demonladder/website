import { useQuery, useQueryClient } from '@tanstack/react-query';
import Container from '../../../components/Container';
import GetNotifications, { NotificationResponse, UnreadFilter } from '../../../api/notifications/GetNotificationsRequest';
import MarkReadNotifications from '../../../api/notifications/MarkReadNotifications';
import { useState } from 'react';
import { SecondaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import MarkAllReadRequest from '../../../api/notifications/MarkAllReadRequest';
import renderToastError from '../../../utils/renderToastError';

export default function Notifications() {
    const [isMutating, setIsMutating] = useState(false);
    const [allOrUnread, setAllOrUnread] = useState<UnreadFilter>('unread');
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['notifications', allOrUnread],
        queryFn: () => GetNotifications({ allOrUnread }),
    });

    function markAllRead() {
        if (isMutating) return;
        setIsMutating(true);

        const promise = MarkAllReadRequest().then(() => {
            queryClient.invalidateQueries(['notifications']);
        }).finally(() => {
            setIsMutating(false);
        });
        
        toast.promise(promise, {
            pending: 'Marking...',
            success: 'Success',
            error: renderToastError,
        });
    }

    return (
        <Container>
            <div>
                <h2 className='text-3xl'>Notifications</h2>
                    <div className='mb-4'>
                        <button className={(allOrUnread === 'all' ? 'bg-white text-black' : 'bg-gray-500') + ' px-2 py-[2px] round:rounded-s'} onClick={() => setAllOrUnread('all')}>All</button>
                        <button className={(allOrUnread === 'unread' ? 'bg-white text-black' : 'bg-gray-500') + ' px-2 py-[2px] round:rounded-e'} onClick={() => setAllOrUnread('unread')}>Unread</button>
                        <SecondaryButton className='ms-4' onClick={markAllRead}>Mark all as read</SecondaryButton>
                    </div>
                {data?.length === 0 &&
                    <p>No notifications</p>
                }
                <ul className='flex flex-col gap-2 xl:gap-1'>
                    {data?.map((notif) => 
                        <Notification notif={notif} key={notif.ID} />
                    )}
                </ul>
            </div>
        </Container>
    );
}

function Notification({ notif }: { notif: NotificationResponse }) {
    const queryClient = useQueryClient();

    function onClick() {
        if (notif.IsRead) return;

        MarkReadNotifications([notif.ID])?.then(() => {
            queryClient.invalidateQueries(['notifications']);
        });
    }
    
    return (
        <li className='flex justify-between group'>
            <div>
                <p className='text-lg'>{!notif.IsRead && <i className='bx bxs-circle' />} {notif.Message} <span className='text-sm text-gray-400'>Sent at {notif.SentAt.toLocaleString()}</span></p>
            </div>
            {!notif.IsRead &&
                <button className='xl:hidden group-hover:inline-block text-xl' onClick={onClick}><i className='bx bx-x' /></button>
            }
        </li>
    );
}