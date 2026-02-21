import { useCallback } from 'react';
import SyncDiscordModal from '../../components/modals/SyncDiscordModal';
import useModal from './useModal';

export default function useSyncDiscordModal() {
    const { createModal, closeModal } = useModal();

    return useCallback(() => {
        const ID = 'sync-discord';
        createModal(ID, <SyncDiscordModal onClose={() => closeModal(ID)} />);
    }, [closeModal, createModal]);
}
