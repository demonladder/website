import { useCallback } from 'react';
import SubmitModal from '../../components/modals/SubmitModal';
import useModal from './useModal';
import SyncDiscordModal from '../../components/modals/SyncDiscordModal';
import useSession from '../useSession';

export default function useSubmitModal() {
    const { createModal, closeModal } = useModal();

    const session = useSession();

    const open = useCallback((level: Parameters<typeof SubmitModal>[0]['level']) => {
        if (!session?.user?.DiscordData) {
            const ID = 'sync-discord';
            createModal(
                ID,
                <SyncDiscordModal onClose={() => closeModal(ID)} />,
            );
            return;
        }

        const ID = `submit-${level.ID}`;
        createModal(
            ID,
            <SubmitModal onClose={() => closeModal(ID)} level={level} userID={session.user.ID} />,
        );
    }, [session, closeModal, createModal]);

    return open;
}