import { useCallback } from 'react';
import { FullLevel } from '../../api/types/compounds/FullLevel';
import SubmitModal from '../../components/modals/SubmitModal';
import useModal from './useModal';
import SyncDiscordModal from '../../components/modals/SyncDiscordModal';
import useUser from '../useUser';

export default function useSubmitModal() {
    const { createModal, closeModal } = useModal();

    const session = useUser();

    const open = useCallback((level: FullLevel) => {
        if (!session?.user?.DiscordData) {
            const ID = 'sync-discord';
            createModal(
                ID,
                <SyncDiscordModal onClose={() => closeModal(ID)} />
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