/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react';
import { NavbarNotificationContext } from './NavbarNotificationContext';

type NotificationType = 'info' | 'warning' | 'error';

function Notification({
    message,
    onClose: close,
    type,
}: {
    message: string;
    onClose: () => void;
    type: NotificationType;
}) {
    let classes = 'px-2 xl:px-32 py-2 min-h-8 flex justify-between items-center ';

    classes += {
        info: 'bg-green-600 text-black',
        warning: 'bg-yellow-500 text-black',
        error: 'bg-red-700 text-white',
    }[type];

    return (
        <div className={classes}>
            <span>{message}</span>
            <button className='bg-black/20 px-2 h-full' onClick={close}>
                dismiss
            </button>
        </div>
    );
}

export default function useNavbarNotification() {
    const context = useContext(NavbarNotificationContext);

    return {
        info: (message: string) =>
            context.addNotification(<Notification type='info' message={message} onClose={() => context.pop()} />),
        warning: (message: string) =>
            context.addNotification(<Notification type='warning' message={message} onClose={() => context.pop()} />),
        error: (message: string) =>
            context.addNotification(<Notification type='error' message={message} onClose={() => context.pop()} />),
        close: (notifId: string) => context.removeNotification(notifId),
    };
}
