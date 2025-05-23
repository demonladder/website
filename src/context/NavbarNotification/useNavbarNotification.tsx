/* eslint-disable react-refresh/only-export-components */
import { useCallback, useContext } from 'react';
import { NavbarNotificationContext } from './NavbarNotificationContext';
import useSyncDiscordModal from '../../hooks/modals/useSyncDiscordModal';

function InfoNotification({ message, onClose: close }: { message: string, onClose: () => void }) {
    return (
        <div className='bg-green-600 text-black px-32 h-8 flex justify-between items-center'>
            <span>{message}</span>
            <button className='bg-black/20 px-2 h-full' onClick={close}>dismiss</button>
        </div>
    );
}

function WarningNotification({ message, onClose: close }: { message: string, onClose: () => void }) {
    return (
        <div className='bg-yellow-500 text-black px-32 h-8 flex justify-between items-center'>
            <span>{message}</span>
            <button className='bg-black/20 px-2 h-full' onClick={close}>dismiss</button>
        </div>
    );
}

function ErrorNotification({ message, onClose: close }: { message: string, onClose: () => void }) {
    return (
        <div className='bg-red-700 text-white px-32 h-8 flex justify-between items-center'>
            <span>{message}</span>
            <button className='bg-black/20 px-2 h-full' onClick={close}>dismiss</button>
        </div>
    );
}

function DiscordSyncNotification({ onClose: close }: { onClose: () => void }) {
    const openModal = useSyncDiscordModal();

    return (
        <div className='bg-neutral-500 text-theme-text px-32 h-8 flex justify-between items-center'>
            <span>You haven't synced your Discord account to your GDDL account yet.</span>
            <div className='h-full'>
                <button className='bg-button-discord-primary hover:bg-button-discord-hover active:bg-button-discord-active transition-colors px-2 h-full' onClick={openModal}>sync now</button>
                <button className='bg-black/20 px-2 h-full' onClick={close}>dismiss</button>
            </div>
        </div>
    );
}

export default function useNavbarNotification() {
    const context = useContext(NavbarNotificationContext);

    const discordSync = useCallback(() => {
        context.addNotification('discord-sync', <DiscordSyncNotification onClose={() => context.removeNotification('discord-sync')} />);
    }, [context]);

    return {
        info: (message: string) => {
            const ID = crypto.randomUUID();
            context.addNotification(ID, <InfoNotification message={message} onClose={() => context.removeNotification(ID)} />);
        },
        warning: (message: string) => {
            const ID = crypto.randomUUID();
            context.addNotification(ID, <WarningNotification message={message} onClose={() => context.removeNotification(ID)} />);
        },
        error: (message: string) => {
            const ID = crypto.randomUUID();
            context.addNotification(ID, <ErrorNotification message={message} onClose={() => context.removeNotification(ID)} />);
        },
        discordSync,
    };
}
