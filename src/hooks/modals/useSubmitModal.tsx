import { useCallback } from 'react';
import { FullLevel } from '../../api/types/compounds/FullLevel';
import SubmitModal from '../../components/modals/SubmitModal';
import useSession from '../useSession';
import useModal from './useModal';
import SyncDiscordModal from '../../components/modals/SyncDiscordModal';

export default function useSubmitModal() {
    const { createModal, closeModal } = useModal();

    const user = useSession();

    const open = useCallback((level: FullLevel) => {
        if (!user?.DiscordData) {
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
            <SubmitModal onClose={() => closeModal(ID)} level={level} userID={user.ID} />,
        );
    }, [user]);

    return open;
}